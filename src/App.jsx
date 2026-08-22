import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { LoginScreen } from './screens/LoginScreen';
import { DashboardScreen } from './screens/DashboardScreen';
import { MyTripsScreen } from './screens/MyTripsScreen';
import { CreateTripScreen } from './screens/CreateTripScreen';
import { ItineraryBuilderScreen } from './screens/ItineraryBuilderScreen';
import { ItineraryViewScreen } from './screens/ItineraryViewScreen';
import { BudgetScreen } from './screens/BudgetScreen';
import { CitySearchScreen } from './screens/CitySearchScreen';
import { ActivitySearchScreen } from './screens/ActivitySearchScreen';
import { SharedTripScreen } from './screens/SharedTripScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { AdminDashboardScreen } from './screens/AdminDashboardScreen';

// We have now implemented all screens!

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<DashboardScreen />} />
            <Route path="/create-trip" element={<CreateTripScreen />} />
            <Route path="/my-trips" element={<MyTripsScreen />} />
            <Route path="/trip/:id/builder" element={<ItineraryBuilderScreen />} />
            <Route path="/trip/:id/view" element={<ItineraryViewScreen />} />
            <Route path="/search/city" element={<CitySearchScreen />} />
            <Route path="/search/activity" element={<ActivitySearchScreen />} />
            <Route path="/trip/:id/budget" element={<BudgetScreen />} />
            <Route path="/profile" element={<ProfileScreen />} />
            <Route path="/admin" element={<AdminDashboardScreen />} />
          </Route>
          {/* Shared route might not need layout or has its own layout */}
          <Route path="/share/:id" element={<SharedTripScreen />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
