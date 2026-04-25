import {
    FiFacebook,
    FiGithub,
    FiGlobe,
    FiInstagram,
    FiLinkedin,
} from "react-icons/fi";

export const THEME_STORAGE_KEY = "json-toolkit-theme";
export const WEBSITE_URL = "https://bilalabdulhadi.com";
export const GITHUB_PROFILE_URL = "https://github.com/bilalabdulhadii";
export const REPO_URL = "https://github.com/bilalabdulhadii/react-json-toolkit";
export const LINKEDIN_URL = "https://www.linkedin.com/in/bilalabdulhadii/";
export const INSTAGRAM_URL = "https://www.instagram.com/bilalabdulhadii/";
export const FACEBOOK_URL = "https://www.facebook.com/bilalabdulhadii/";

export const LOGO_LIGHT_SRC = `${process.env.PUBLIC_URL}/logo-light.png`;
export const LOGO_DARK_SRC = `${process.env.PUBLIC_URL}/logo-dark.png`;
export const PROFILE_IMAGE_SRC = `${process.env.PUBLIC_URL}/profile.jpg`;

export const socialLinks = [
    {
        href: WEBSITE_URL,
        label: "Website",
        icon: FiGlobe,
    },
    {
        href: GITHUB_PROFILE_URL,
        label: "GitHub",
        icon: FiGithub,
    },
    {
        href: LINKEDIN_URL,
        label: "LinkedIn",
        icon: FiLinkedin,
    },
    {
        href: INSTAGRAM_URL,
        label: "Instagram",
        icon: FiInstagram,
    },
    {
        href: FACEBOOK_URL,
        label: "Facebook",
        icon: FiFacebook,
    },
];

export const getLogoSrc = (theme) =>
    theme === "dark" ? LOGO_DARK_SRC : LOGO_LIGHT_SRC;
