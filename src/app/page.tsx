import HeroNavigation from "@/_components/public/hero-navigation";
import HeroTags from "@/_components/public/hero-tags";
import MainNavBanner  from "@/_components/public/main-nav-banner";
import GlobalSocialBanner from "@/_components/public/social-banner";

export default function Home() {
    return(
        <>
            <GlobalSocialBanner />
            <MainNavBanner />
            <HeroNavigation />
            <HeroTags />
            {/* <BreakingNews /> */}

        </>
    )
}
