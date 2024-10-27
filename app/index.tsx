import { Redirect } from 'expo-router';
import CurrencyScreen from './CurrencyScreen';

export default function Index() {
  // You can add logic here to check if the user should see the onboarding screen
  // For now, we'll always redirect to onboarding
  return <Redirect href="/onboarding" />;
}

