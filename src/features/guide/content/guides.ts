import type { DocPage } from "../types";
import { CORE_GUIDES } from "./guides-core";
import { MORE_GUIDES } from "./guides-more";

/** Every guide, in course order. Each one links to the lesson that practises it. */
export const GUIDE_PAGES: DocPage[] = [...CORE_GUIDES, ...MORE_GUIDES];
