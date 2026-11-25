/**
 * PHP code loaded before the learner's files. It must run on every version
 * from 7.4 to 8.5, so it only uses PHP 7.4 syntax and functions.
 *
 * What it records (into /tmp/__result.json at shutdown):
 *  - steps: one entry per executed statement (via `declare(ticks=1)` injected
 *    into the learner's files): file, line, call stack, output offset, the
 *    variables that changed, and the current function's arguments.
 *  - problems: warnings, notices, deprecations, uncaught exceptions and fatal
 *    errors, each with the output offset where it happened and a stack trace.
 *  - globals: the final value of every global variable.
 *  - probes: the value of each probe expression, evaluated after the script.
 */
export const PRELUDE = String.raw`<?php
ini_set('display_errors', '0');
ini_set('html_errors', '0');
ini_set('log_errors', '0');
error_reporting(E_ALL);

final class __PL {
    public static $steps = [];
    public static $problems = [];
    public static $ticks = 0;
    public static $recorded = 0;
    public static $maxRecord = 2500;
    public static $maxTicks = 300000;
    public static $prev = [];
    public static $probes = [];
    public static $probeResults = [];
    public static $userDir = '/app/';
    public static $params = [];
    public static $fatal = false;
    public static $stopped = '';
    public static $off = false;

    public static function isUser($file) {
        return is_string($file) && strpos($file, self::$userDir) === 0 && strpos($file, '__') === false;
    }

    public static function type($v) {
        if (is_null($v)) return 'null';
        if (is_bool($v)) return 'bool';
        if (is_int($v)) return 'int';
        if (is_float($v)) return 'float';
        if (is_string($v)) return 'string';
        if (is_array($v)) return 'array';
        if ($v instanceof \Closure) return 'Closure';
        if (is_object($v)) return get_class($v);
        if (is_resource($v)) return 'resource';
        return gettype($v);
    }

    public static function str($s, $max) {
        $s = (string) $s;
        if (strlen($s) > $max) $s = substr($s, 0, $max) . '…';
        return '"' . addcslashes($s, "\"\\\n\r\t") . '"';
    }

    /** A short, readable representation, like a debugger's variables panel. */
    public static function repr($v, $depth = 0, $max = 120) {
        if (is_null($v)) return 'null';
        if (is_bool($v)) return $v ? 'true' : 'false';
        if (is_int($v)) return (string) $v;
        if (is_float($v)) {
            if (is_nan($v)) return 'NAN';
            if (is_infinite($v)) return $v > 0 ? 'INF' : '-INF';
            $s = var_export($v, true);
            return $s;
        }
        if (is_string($v)) return self::str($v, 60);
        if (is_array($v)) {
            if ($depth > 1) return '[…' . count($v) . ']';
            $list = $v === [] || array_keys($v) === range(0, count($v) - 1);
            $parts = [];
            $i = 0;
            foreach ($v as $k => $item) {
                if (++$i > 8) { $parts[] = '…'; break; }
                $parts[] = $list ? self::repr($item, $depth + 1) : (is_int($k) ? $k : self::str($k, 24)) . ' => ' . self::repr($item, $depth + 1);
            }
            $out = '[' . implode(', ', $parts) . ']';
            return strlen($out) > $max ? substr($out, 0, $max) . '…]' : $out;
        }
        if ($v instanceof \Closure) return 'Closure';
        if (is_object($v)) {
            $class = get_class($v);
            if (function_exists('enum_exists') && $v instanceof \UnitEnum) {
                return $class . '::' . $v->name . (property_exists($v, 'value') ? ' (' . self::repr($v->value, 2) . ')' : '');
            }
            if ($v instanceof \DateTimeInterface) return $class . ' ' . $v->format('Y-m-d H:i:s');
            if ($depth > 1) return $class . ' {…}';
            $parts = [];
            $i = 0;
            foreach ((array) $v as $k => $item) {
                if (++$i > 6) { $parts[] = '…'; break; }
                $name = $k;
                $vis = '';
                if (is_string($k) && strlen($k) && $k[0] === "\0") {
                    $bits = explode("\0", $k);
                    $name = end($bits);
                    $vis = $bits[1] === '*' ? '#' : '-';
                }
                $parts[] = $vis . $name . ': ' . self::repr($item, $depth + 1);
            }
            $out = $class . ' {' . implode(', ', $parts) . '}';
            return strlen($out) > $max ? substr($out, 0, $max) . '…}' : $out;
        }
        if (is_resource($v)) return 'resource(' . get_resource_type($v) . ')';
        return gettype($v);
    }

    public static function globals() {
        $skip = ['GLOBALS' => 1, '_GET' => 1, '_POST' => 1, '_COOKIE' => 1, '_FILES' => 1, '_SERVER' => 1, '_ENV' => 1, '_REQUEST' => 1, '_SESSION' => 1, 'argv' => 1, 'argc' => 1];
        $out = [];
        foreach ($GLOBALS as $k => $v) {
            if (isset($skip[$k]) || strpos((string) $k, '__') === 0) continue;
            $out[$k] = [self::type($v), self::repr($v)];
        }
        return $out;
    }

    public static function paramNames($frame) {
        $key = (isset($frame['class']) ? $frame['class'] . '::' : '') . $frame['function'];
        if (isset(self::$params[$key])) return self::$params[$key];
        $names = [];
        try {
            if (strpos($frame['function'], '{closure') !== false) {
                $names = [];
            } elseif (isset($frame['class'])) {
                $r = new \ReflectionMethod($frame['class'], $frame['function']);
                foreach ($r->getParameters() as $p) $names[] = $p->getName();
            } elseif (function_exists($frame['function'])) {
                $r = new \ReflectionFunction($frame['function']);
                foreach ($r->getParameters() as $p) $names[] = $p->getName();
            }
        } catch (\Throwable $e) {
        }
        return self::$params[$key] = $names;
    }

    public static function frameName($f) {
        $fn = isset($f['function']) ? $f['function'] : '?';
        if (strpos($fn, '{closure') !== false) $fn = '{closure}';
        return (isset($f['class']) ? $f['class'] . (isset($f['type']) ? $f['type'] : '::') : '') . $fn;
    }

    public static function out() {
        $n = ob_get_level() > 0 ? ob_get_length() : 0;
        return $n === false ? 0 : $n;
    }

    public static function tick() {
        if (self::$off) return;
        if (++self::$ticks > self::$maxTicks) {
            self::$stopped = 'steps';
            exit(1);
        }
        if (self::$recorded >= self::$maxRecord) return;
        $bt = debug_backtrace(DEBUG_BACKTRACE_PROVIDE_OBJECT);
        $here = isset($bt[0]) ? $bt[0] : null;
        if (!$here || !isset($here['file']) || !self::isUser($here['file'])) return;
        $stack = [];
        $locals = null;
        for ($i = 1, $n = count($bt); $i < $n; $i++) {
            $f = $bt[$i];
            if (!isset($f['function']) || in_array($f['function'], ['require', 'require_once', 'include', 'include_once'], true)) continue;
            if (isset($f['class']) && $f['class'] === '__PL') continue;
            $stack[] = self::frameName($f);
            if ($locals === null) {
                $locals = [];
                $names = self::paramNames($f);
                foreach (isset($f['args']) ? $f['args'] : [] as $j => $arg) {
                    $name = isset($names[$j]) ? $names[$j] : 'arg' . $j;
                    $locals[$name] = [self::type($arg), self::repr($arg)];
                }
                if (isset($f['object'])) $locals['this'] = [get_class($f['object']), self::repr($f['object'])];
            }
        }
        $g = self::globals();
        $changed = [];
        foreach ($g as $k => $v) {
            if (!isset(self::$prev[$k]) || self::$prev[$k] !== $v) $changed[$k] = $v;
        }
        $removed = array_values(array_diff(array_keys(self::$prev), array_keys($g)));
        self::$prev = $g;
        self::$recorded++;
        $step = ['f' => substr($here['file'], strlen(self::$userDir)), 'l' => $here['line'], 's' => $stack, 'o' => self::out()];
        if ($changed) $step['g'] = $changed;
        if ($removed) $step['r'] = $removed;
        if ($locals) $step['a'] = $locals;
        self::$steps[] = $step;
    }

    public static function frames($trace) {
        $out = [];
        foreach ($trace as $f) {
            if (isset($f['class']) && $f['class'] === '__PL') continue;
            if (isset($f['function']) && in_array($f['function'], ['require', 'require_once', 'include', 'include_once'], true) && (!isset($f['file']) || !self::isUser($f['file']))) continue;
            $file = isset($f['file']) && self::isUser($f['file']) ? substr($f['file'], strlen(self::$userDir)) : null;
            $out[] = ['fn' => self::frameName($f), 'f' => $file, 'l' => isset($f['line']) ? $f['line'] : null];
        }
        return $out;
    }

    public static function problem($kind, $severity, $message, $file, $line, $trace) {
        if (count(self::$problems) > 60) return;
        self::$problems[] = [
            'k' => $kind,
            's' => $severity,
            'm' => $message,
            'f' => self::isUser($file) ? substr($file, strlen(self::$userDir)) : null,
            'l' => $line,
            'o' => self::out(),
            't' => self::frames($trace),
        ];
    }

    public static function errorName($no) {
        $map = [E_WARNING => 'Warning', E_NOTICE => 'Notice', E_USER_ERROR => 'Fatal error', E_USER_WARNING => 'Warning', E_USER_NOTICE => 'Notice', E_DEPRECATED => 'Deprecated', E_USER_DEPRECATED => 'Deprecated', E_RECOVERABLE_ERROR => 'Recoverable fatal error', E_COMPILE_WARNING => 'Warning', E_CORE_WARNING => 'Warning'];
        if (defined('E_STRICT') && $no === 2048) return 'Strict Standards';
        return isset($map[$no]) ? $map[$no] : 'Error';
    }

    public static function onError($no, $msg, $file = '', $line = 0) {
        if (!(error_reporting() & $no)) return false;
        $name = self::errorName($no);
        $sev = $name === 'Deprecated' ? 'deprecated' : ($name === 'Notice' ? 'notice' : ($no === E_USER_ERROR || $no === E_RECOVERABLE_ERROR ? 'error' : 'warning'));
        $bt = debug_backtrace();
        array_shift($bt);
        self::problem($name, $sev, $msg, $file, $line, $bt);
        if ($no === E_USER_ERROR) { self::$fatal = true; exit(255); }
        return true;
    }

    public static function onException($e) {
        self::$fatal = true;
        $chain = [];
        $prev = $e->getPrevious();
        while ($prev && count($chain) < 3) {
            $chain[] = get_class($prev) . ': ' . $prev->getMessage();
            $prev = $prev->getPrevious();
        }
        $msg = $e->getMessage();
        if ($chain) $msg .= ' (previous: ' . implode('; ', $chain) . ')';
        self::problem(get_class($e), 'error', $msg, $e->getFile(), $e->getLine(), $e->getTrace());
    }

    public static function shutdown() {
        self::$off = true;
        $err = error_get_last();
        if ($err && in_array($err['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR], true)) {
            self::$fatal = true;
            $kind = $err['type'] === E_PARSE ? 'Parse error' : 'Fatal error';
            $already = false;
            foreach (self::$problems as $p) if ($p['m'] === $err['message']) $already = true;
            if (!$already) self::problem($kind, 'error', $err['message'], $err['file'], $err['line'], []);
        }
        if (!self::$fatal || self::$stopped === '') {
            foreach (self::$probes as $i => $expr) {
                $level = ob_get_level();
                ob_start();
                try {
                    $v = eval('return ' . $expr . ';');
                    self::$probeResults[$i] = ['ok' => true, 't' => self::type($v), 'v' => self::repr($v, 0, 400), 'j' => is_scalar($v) || is_null($v) || is_array($v) ? json_encode($v, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) : null];
                } catch (\Throwable $e) {
                    self::$probeResults[$i] = ['ok' => false, 't' => get_class($e), 'v' => $e->getMessage()];
                }
                $printed = ob_get_clean();
                while (ob_get_level() > $level) ob_end_clean();
                self::$probeResults[$i]['p'] = $printed;
            }
        }
        $funcs = get_defined_functions();
        $classes = [];
        foreach (array_merge(get_declared_classes(), get_declared_interfaces(), function_exists('get_declared_traits') ? get_declared_traits() : []) as $c) {
            try {
                $r = new \ReflectionClass($c);
                if (self::isUser($r->getFileName())) $classes[] = $c;
            } catch (\Throwable $e) {
            }
        }
        $result = [
            'version' => PHP_VERSION,
            'steps' => self::$steps,
            'ticks' => self::$ticks,
            'problems' => self::$problems,
            'globals' => self::globals(),
            'probes' => self::$probeResults,
            'functions' => array_values(array_filter($funcs['user'], function ($f) { return strpos($f, '__') !== 0; })),
            'classes' => $classes,
            'stopped' => self::$stopped,
            'out' => self::out(),
        ];
        $json = json_encode($result, JSON_PARTIAL_OUTPUT_ON_ERROR | JSON_INVALID_UTF8_SUBSTITUTE);
        file_put_contents('/tmp/__result.json', $json === false ? '{}' : $json);
    }
}

set_error_handler(['__PL', 'onError']);
set_exception_handler(['__PL', 'onException']);
register_shutdown_function(['__PL', 'shutdown']);
register_tick_function(['__PL', 'tick']);
ob_start();
`;

/** The script php-wasm runs: prelude, probes, then the learner's entry file. */
export function runnerScript(entry: string, probes: string[]) {
  const list = probes.map((p) => `'${p.replace(/\\/g, "\\\\").replace(/'/g, "\\'")}'`).join(", ");
  return `<?php
require '/app/__prelude.php';
__PL::$probes = [${list}];
require '/app/${entry}';
`;
}
