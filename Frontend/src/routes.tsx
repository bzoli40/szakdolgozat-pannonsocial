import ErrorLayout from "./layouts/errorLayout"
import MainLayout from "./layouts/mainLayout"
import NewsEditorPage from "./pages/editors/newsEditorPage"
import EventsPage from "./pages/events/eventsPage"
import StarterPage from "./pages/main/starterPage"
import NewsInspectPage from "./pages/news/newsInspectPage"
import NewsPage from "./pages/news/newsPage"

const routes = () => [
    {
        path: '/',
        element: <MainLayout />,
        children: [
            { path: '', element: <StarterPage /> },
        ]
    },
    {
        path: 'hiba/',
        element: <ErrorLayout />
    },
    {
        path: 'hirek/',
        element: <MainLayout />,
        children: [
            { path: '', element: <NewsPage /> },
            { path: ':hirID', element: <NewsInspectPage /> }
        ]
    },
    {
        path: 'esemenyek/',
        element: <MainLayout />,
        children: [
            { path: '', element: <EventsPage /> },
            { path: ':esemenyID', element: <NewsInspectPage /> }
        ]
    },
    {
        path: 'szerkeszto/',
        element: <MainLayout />,
        children: [
            { path: '', element: <NewsEditorPage /> },
            { path: 'hir', element: <NewsEditorPage /> }
        ]
    }
]

export default routes