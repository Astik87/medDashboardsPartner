import React from "react"

import AdminUsers from '@adminPages/AdminUsers'

import NotFound from "@pages/NotFound";
import Medtouch from "@pages/Medtouch";
import LongRead from "@pages/LongRead";
import Events from "@pages/Events";
import VisitPlan from "@pages/VisitPlan";
import EventPlans from "@pages/EventPlans";
import LongReadPlans from "@pages/LongReadPlans";
import Waves from "@pages/Waves";
import Auth from "@pages/Auth";
import Forbidden from "@pages/Forbidden";

import MainTabs from '@components/Layout/Sidebar/AdminTabs/MainTabs'
import Partners from "@adminPages/Partners";

import LongReadTab from "@components/Layout/Sidebar/Tabs/LongReadTab";
import WavesTabs from "@components/Layout/Sidebar/Tabs/WavesTabs";
import NotFoundTab from "@components/Layout/Sidebar/Tabs/NotFoundTab";

const authRoutes = [
    // {
    //     path: '/long-read',
    //     Component: <LongRead />
    // },
    // {
    //     path: '/events',
    //     Component: <Events />
    // },
    {
        path: '/waves',
        Component: <Waves />
    },
    {
        path: '/waves/visit-plans',
        Component: <VisitPlan baseUri="/visits" />
    },
    {
        path: '/visits/:page',
        Component: <VisitPlan baseUri="/visits" />
    },
    {
        path: '/waves/event-plans',
        Component: <EventPlans />
    },
    {
        path: '/waves/long-read-plans',
        Component: <LongReadPlans />
    }
]

const adminRoutes = [
    {
        path: '/admin',
        Component: <NotFound />
    },
    {
        path: '/admin/users',
        Component: <AdminUsers />
    },
    {
        path: '/admin/partners',
        Component: <Partners />
    },
    {
        path: '/admin/*',
        Component: <NotFound />
    }
]

const publicRoutes = [
    {
        path: '/auth',
        Component: <Auth />
    },
    {
        path: '*',
        Component: <NotFound />
    }
]


const sidebarRoutes = [
    {path: '/long-read', Component: <LongReadTab/>},
    {path: "/waves", Component: <WavesTabs/>},
    {path: "/waves/visit-plans", Component: <WavesTabs/>},
    {path: "/waves/event-plans", Component: <WavesTabs/>},
    {path: "/waves/long-read-plans", Component: <WavesTabs/>},
    {path: '*', Component: <NotFoundTab/>}
]

const adminSideBarRoutes = [
    // {
    //     path: '/admin/users',
    //     Component: <NotFoundTab />
    // },
    {
        path: '/admin/*',
        Component: <MainTabs />
    }
]

export {
    publicRoutes,
    authRoutes,
    adminRoutes,
    adminSideBarRoutes,
    sidebarRoutes
}
