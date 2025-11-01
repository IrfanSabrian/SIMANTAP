declare module "aos" {
  export interface AosOptions {
    offset?: number;
    delay?: number;
    duration?: number;
    easing?: string;
    once?: boolean;
    mirror?: boolean;
    anchorPlacement?: string;
  }

  export default {
    init(options?: AosOptions): void;
    refresh(): void;
    refreshHard(): void;
  };
}

