import { useNavigate } from "react-router-dom";
import logo from "/assets/logo.svg";
import { useContext, useEffect } from "react";
import { type ReactNode, useState } from "react";
import { createPortal } from "react-dom";
import { ContentLayout, Icon } from "@cloudscape-design/components";
import { I18nProvider } from "@cloudscape-design/components/i18n";
import messages from "@cloudscape-design/components/i18n/messages/all.en";
import TopNavigation from "@cloudscape-design/components/top-navigation";
import type { ILandingPageLayoutProps } from "./interfaces";
import StickyFooter from "../components/StickyFooter";
import DashboardRoutes from "../routes/DashboardRoutes";
import { AuthContext } from "../contexts/AuthContext";
import { UserContext } from "../contexts/UserContext";

import "@cloudscape-design/global-styles/index.css";
import "../Landing.css";
import "../styles/base.scss";
import "../styles/top-navigation.scss";
import { logger } from "../lib/logger";

const emptyIcon = (
  <Icon
    svg={
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        focusable="false"
        key="0"
      >
        <g></g>
      </svg>
    }
  />
);

const checkedIcon = (
  <Icon
    svg={
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        focusable="false"
        key="0"
      >
        <g>
          <path d="m1 9 4 4L15 2"></path>
        </g>
      </svg>
    }
  />
);

const handleUserMenuClick = (event, authContext, navigate) => {
  const { setIsAuthenticated, setUser } = authContext;

  logger.debug("in handleUserMenuClick");
  logger.debug("event:", event);

  event.preventDefault();
  event.stopPropagation();

  if (event?.detail?.id == "signout") {
    logger.debug("log out user");
    setIsAuthenticated(false);
    setUser(null);
  } else if (event?.detail?.id == "preferences") {
    navigate(`/${DashboardRoutes.path}/preferences`);
  } else if (event?.detail?.id == "profile") {
    navigate(`/${DashboardRoutes.path}/profile`);
  }
};

const LOCALE = "en";

interface IDemoMainBarPortalProps {
  children: ReactNode;
}
const DemoHeaderPortal = ({ children }: IDemoMainBarPortalProps) => {
  const domNode = document.querySelector("#h")!;
  return createPortal(children, domNode);
};

const i18nStrings = {
  searchIconAriaLabel: "Search",
  searchDismissIconAriaLabel: "Close search",
  overflowMenuTriggerText: "More",
  overflowMenuTitleText: "All",
  overflowMenuBackIconAriaLabel: "Back",
  overflowMenuDismissIconAriaLabel: "Close menu",
};

function LandingPageLayout(props: ILandingPageLayoutProps) {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  const { isAuthenticated, setIsAuthenticated, setUser } = authContext;

  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error("UserContext context is not present");
  }
  const { defaultTheme, defaultDensity } = userContext;

  const navigate = useNavigate();

  const handleNavigationClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (!event.detail.href) {
      navigate("/");
    }
    navigate(event.detail.href);
  };

  const handlePrefClick = (event, userContext) => {
    const { setTheme, setDensity } = userContext;

    event.preventDefault();
    event.stopPropagation();

    logger.debug("pref itemClick clicked: ", event);
    switch (event.detail.id) {
      case "theme-light":
        setTheme({ label: "Light", value: "light" });
        break;
      case "theme-dark":
        setTheme({ label: "Dark", value: "dark" });
        break;
      case "layout-normal":
        setDensity({ value: "normal", label: "Comfortable" });
        break;
      case "layout-compact":
        setDensity({ value: "compact", label: "Compact" });
        break;
    }
  };

  const handleSignOutClick = (event) => {
    logger.debug("in handleSignOutClick");
    event.preventDefault();
    event.stopPropagation();

    setIsAuthenticated(false);
    setUser(null);
  };

  const profileActions = [
    {
      id: "profile",
      text: "Profile",
      href: import.meta.env.BASE_URL + `${DashboardRoutes.path}/profile`,
      onClick: handleNavigationClick,
    },
    {
      id: "preferences",
      text: "Preferences",
      href: import.meta.env.BASE_URL + `${DashboardRoutes.path}/preferences`,
      onClick: handleNavigationClick,
    },
    { id: "signout", text: "Sign out", href: "#", onClick: handleSignOutClick },
  ];
  const [userData, setUserData] = useState({
    type: "button",
    iconName: "user-profile",
    title: "Account",
    ariaLabel: "Account",
    href: "/login",
    onClick: handleNavigationClick,
  });

  const headerVariant = "divider";

  useEffect(() => {
    if (isAuthenticated) {
      setUserData({
        type: "menu-dropdown",
        text: "Admin",
        description: "john.doe@gmail.com",
        iconName: "user-profile",
        onItemClick: (event) =>
          handleUserMenuClick(event, authContext, navigate),
        items: profileActions,
      });
    } else {
      logger.debug("not auth");
      setUserData({
        type: "button",
        iconName: "user-profile",
        title: "Account",
        ariaLabel: "Account",
        href: "/login",
        onClick: handleNavigationClick,
      });
    }
  }, [isAuthenticated]);

  const authLinks = [
    {
      type: "button",
      text: "Dashboard",
      href: "/dashboard",
      onFollow: handleNavigationClick,
    },
  ];

  if (!isAuthenticated) {
    authLinks.pop();
  }

  return (
    <>
      <I18nProvider locale={LOCALE} messages={[messages]}>
        <DemoHeaderPortal>
          <TopNavigation
            i18nStrings={i18nStrings}
            identity={{
              href: "/",
              title: "S90",
              logo: { src: logo, alt: "S90" },
              onFollow: handleNavigationClick,
            }}
            utilities={[
              ...authLinks,
              {
                type: "button",
                text: "About",
                href: "/about",
                onFollow: handleNavigationClick,
              },
              {
                type: "menu-dropdown",
                iconName: "settings",
                ariaLabel: "Settings",
                title: "Settings",
                onItemClick: (event) => handlePrefClick(event, userContext),
                items: [
                  {
                    id: "support",
                    text: "Theme",
                    items: [
                      {
                        id: "theme-light",
                        text: "Light",
                        disabled: false,
                        iconSvg:
                          defaultTheme.value === "light"
                            ? checkedIcon
                            : emptyIcon,
                      },
                      {
                        id: "theme-dark",
                        text: "Dark",
                        disabled: false,
                        iconSvg:
                          defaultTheme.value === "dark"
                            ? checkedIcon
                            : emptyIcon,
                      },
                    ],
                  },
                  {
                    id: "support",
                    text: "Density",
                    items: [
                      {
                        id: "layout-normal",
                        text: "Comfortable",
                        disabled: false,
                        iconSvg:
                          defaultDensity.value === "normal"
                            ? checkedIcon
                            : emptyIcon,
                      },
                      {
                        id: "layout-compact",
                        text: "Compact",
                        disabled: false,
                        iconSvg:
                          defaultDensity.value === "compact"
                            ? checkedIcon
                            : emptyIcon,
                      },
                    ],
                  },
                ],
              },
              userData,
            ]}
          />
        </DemoHeaderPortal>
        <ContentLayout
          headerVariant={headerVariant}
          header={props.header}
          defaultPadding={true}
          maxContentWidth={1400}
          disableOverlap={true}
        >
          <main className="product-page-content">{props.content}</main>
        </ContentLayout>
        <StickyFooter />
      </I18nProvider>
    </>
  );
}

export default LandingPageLayout;
