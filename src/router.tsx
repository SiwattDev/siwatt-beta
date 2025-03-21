import { Navigate, Route, HashRouter as Router, Routes } from 'react-router-dom'
import Budgets from './components/pages/Budgets/Budgets'
import BudgetDetails from './components/pages/Budgets/NewBudget/BudgetDetails/BudgetDetails'
import NewBudget from './components/pages/Budgets/NewBudget/NewBudget'
import Clients from './components/pages/Clients/Clients'
import Companies from './components/pages/Companies/Companies'
import CreateEntity from './components/pages/CreateEntity/CreateEntity'
import Dashboard from './components/pages/Dashboard'
import Funnel from './components/pages/Funnel/Funnel'
import Login from './components/pages/Login/Login'
import NotFound from './components/pages/NotFound/NotFound'
import Partners from './components/pages/Partners/Partners'
import Products from './components/pages/Products/Products'
import Teams from './components/pages/Teams/Teams'
import Units from './components/pages/Units/Units'
import Users from './components/pages/Users/Users'
import SellerVisits from './components/pages/Visits/SellerVisits/SellerVisits'
import VisitDetails from './components/pages/Visits/SellerVisits/VisitDetails/VisitDetails'
import Visits from './components/pages/Visits/Visits'
import WelcomeAdmin from './components/pages/WelcomeAdmin/WelcomeAdmin'

function AppRouter() {
    const routes = [
        {
            path: '/',
            element: <Login />,
        },
        {
            path: '/welcome',
            element: <WelcomeAdmin />,
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
                {
                    path: 'budgets/:id',
                    element: <BudgetDetails />,
                },
                {
                    path: 'units',
                    element: <Units />,
                },
                {
                    path: 'create-entity',
                    element: <CreateEntity />,
                },
                {
                    path: 'clients',
                    element: <Clients />,
                },
                {
                    path: 'users',
                    element: <Users />,
                },
                {
                    path: 'products',
                    element: <Products />,
                },
                {
                    path: 'visits',
                    element: <Visits />,
                },
                {
                    path: 'visits/seller/:sellerId',
                    element: <SellerVisits />,
                },
                {
                    path: 'visits/seller/:sellerId/:visitId',
                    element: <VisitDetails />,
                },
                {
                    path: 'partners',
                    element: <Partners />,
                },
                {
                    path: 'teams',
                    element: <Teams />,
                },
                {
                    path: 'companies',
                    element: <Companies />,
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
