// Every off-site link in one place. The footer and /contact both render from
// this, so adding a profile means editing one array.

export type SocialKey =
  | "email"
  | "github"
  | "linkedin"
  | "instagram"
  | "contra";

export type SocialLink = {
  key: SocialKey;
  label: string;
  href: string;
  /** Screen-reader name. The visible label is often just "GitHub". */
  title: string;
};

export const EMAIL = "randall.floresespinoza@gmail.com";

export const SOCIAL: SocialLink[] = [
  {
    key: "github",
    label: "GitHub",
    href: "https://github.com/randallfloresespinoza-coder",
    title: "GitHub profile",
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/randallflores1493/",
    title: "LinkedIn profile",
  },
  {
    key: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/r_flores_e/",
    title: "Instagram profile",
  },
  {
    key: "contra",
    label: "Contra",
    href: "https://contra.com/randall_flores_n1w62fvm/work?r=randall_flores_n1w62fvm",
    title: "Contra profile",
  },
];
