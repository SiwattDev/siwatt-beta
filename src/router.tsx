import { Navigate, Route, HashRouter as Router, Routes } from 'react-router-dom'
import Budgets from './components/pages/Budgets/Budgets'
import NewBudget from './components/pages/Budgets/NewBudget/NewBudget'
import Dashboard from './components/pages/Dashboard'
import Funnel from './components/pages/Funnel/Funnel'
import Login from './components/pages/Login/Login'
import NotFound from './components/pages/NotFound/NotFound'

function AppRouter() {
    const routes = [
        {
            path: '/',
            element: <Login />,
        },
        {
            path: '/dashboard',
            element: <Dashboard />,
            children: [
                {
                    index: true,
                    element: <Navigate to='funnel' replace />,
                },
                {
                    path: 'funnel',
                    element: <Funnel />,
                },
                {
                    path: 'budgets',
                    element: <Budgets />,
                },
                {
                    path: 'budgets/new',
                    element: <NewBudget />,
                },
            ],
        },
        {
            path: '*',
            element: <NotFound fullPage />,
        },
    ]

    return (
        <Router>
            <Routes>
                {routes.map((route, index) => (
                    <Route
                        key={index}
                        path={route.path}
                        element={route.element}
                    >
                        {route.children?.map((child, index) => (
                            <Route
                                key={index}
                                index={child.index}
                                path={child.path}
                                element={child.element}
                            />
                        ))}
                    </Route>
                ))}
            </Routes>
        </Router>
    )
}

export default AppRouter
