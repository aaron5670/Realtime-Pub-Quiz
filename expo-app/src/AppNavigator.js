import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import Dashboard from "./pages/DashboardPage";
import Login from "./pages/LoginPage";
import Register from "./pages/RegisterPage";
import Settings from "./components/SettingsTab";

const AppNavigator = createStackNavigator(
    {
        Login: Login,
        Dashboard: Dashboard,
        Settings: Settings,
        Register: Register,
    },
    {
        headerMode: 'none',
        navigationOptions: {
            headerVisible: false,
        }
    }
);

export default createAppContainer(AppNavigator);
