import FuseLayout from '@fuse/core/FuseLayout';
import { SnackbarProvider } from 'notistack';
import themeLayouts from 'src/components/theme-layouts/themeLayouts';
import { Provider } from 'react-redux';
import FuseSettingsProvider from '@fuse/core/FuseSettings/FuseSettingsProvider';
import { I18nProvider } from '@i18n/I18nProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { enUS } from 'date-fns/locale/en-US';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import ErrorBoundary from '@fuse/utils/ErrorBoundary';
// Import the combined authentication
import AuthenticationWithSupabase from '@auth/AuthenticationWithSupabase';
import MainThemeProvider from '../contexts/MainThemeProvider';
import store from 'src/store/store';
import { Outlet } from 'react-router-dom';
import AppContext from 'src/contexts/AppContext';

/**
 * The main App component.
 * Provides global state, authentication, and theming.
 */
function App() {
	const AppContextValue = {
		routes: [] // We don't pass routes here to avoid circular dependency
	};

	return (
		<ErrorBoundary>
			<AppContext value={AppContextValue}>
				{/* Date Picker Localization Provider */}
				<LocalizationProvider
					dateAdapter={AdapterDateFns}
					adapterLocale={enUS}
				>
					{/* Redux Store Provider */}
					<Provider store={store}>
						{/* Updated to use the combined authentication */}
						<AuthenticationWithSupabase>
							<FuseSettingsProvider>
								<I18nProvider>
									{/* Theme Provider */}
									<MainThemeProvider>
										{/* Notistack Notification Provider */}
										<SnackbarProvider
											maxSnack={5}
											anchorOrigin={{
												vertical: 'bottom',
												horizontal: 'right'
											}}
											classes={{
												containerRoot: 'bottom-0 right-0 mb-52 md:mb-68 mr-8 lg:mr-80 z-99'
											}}
										>
											<FuseLayout layouts={themeLayouts}>
												<Outlet /> {/* This renders child routes */}
											</FuseLayout>
										</SnackbarProvider>
									</MainThemeProvider>
								</I18nProvider>
							</FuseSettingsProvider>
						</AuthenticationWithSupabase>
					</Provider>
				</LocalizationProvider>
			</AppContext>
		</ErrorBoundary>
	);
}

export default App;