import { HeroBreakingNews } from "@/_components/public/hero-breaking-news";
import HeroNavigation from "@/_components/public/hero-navigation";
import HeroTags from "@/_components/public/hero-tags";
import HeroTopNewsGrid from "@/_components/pages/public-home/hero-top-news-grid";
import MainNavBanner  from "@/_components/public/main-nav-banner";
import GlobalSocialBanner from "@/_components/public/social-banner";

export default function Home() {
    return(
        <div>
            <GlobalSocialBanner />
            <MainNavBanner />
            {/* hero component -- i may use this later on */}
            <>
                <HeroNavigation />
                <HeroTags />
                <HeroBreakingNews />
            </>

            <HeroTopNewsGrid />

        </div>
    )
}
