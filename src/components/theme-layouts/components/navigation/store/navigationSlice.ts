import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk, RootState } from 'src/store/store';
import { PartialDeep } from 'type-fest';
import { FuseFlatNavItemType, FuseNavItemType } from '@fuse/core/FuseNavigation/types/FuseNavItemType';
import FuseNavigationHelper from '@fuse/utils/FuseNavigationHelper';
import FuseNavItemModel from '@fuse/core/FuseNavigation/models/FuseNavItemModel';
import navigationConfig from 'src/configs/navigationConfig'; // ✅ Ensure correct import

// Initialize Entity Adapter for Navigation
const navigationAdapter = createEntityAdapter<FuseFlatNavItemType>();

// Ensure Initial State is Correct
const emptyInitialState = navigationAdapter.getInitialState([]);
const initialState = navigationConfig
	? navigationAdapter.upsertMany(emptyInitialState, FuseNavigationHelper.flattenNavigation(navigationConfig))
	: emptyInitialState;

/**
 * Redux Thunk Actions: Manage Sidebar Navigation State
 */

// Append a navigation item
export const appendNavigationItem =
	(item: FuseNavItemType, parentId?: string | null): AppThunk =>
	async (dispatch, getState) => {
		const appState = getState();
		const navigation = FuseNavigationHelper.unflattenNavigation(selectNavigationAll(appState));

		dispatch(setNavigation(FuseNavigationHelper.appendNavItem(navigation, FuseNavItemModel(item), parentId)));

		return Promise.resolve();
	};

// Prepend a navigation item
export const prependNavigationItem =
	(item: FuseNavItemType, parentId?: string | null): AppThunk =>
	async (dispatch, getState) => {
		const appState = getState();
		const navigation = FuseNavigationHelper.unflattenNavigation(selectNavigationAll(appState));

		dispatch(setNavigation(FuseNavigationHelper.prependNavItem(navigation, FuseNavItemModel(item), parentId)));

		return Promise.resolve();
	};

// Update a navigation item
export const updateNavigationItem =
	(id: string, item: PartialDeep<FuseNavItemType>): AppThunk =>
	async (dispatch, getState) => {
		const appState = getState();
		const navigation = FuseNavigationHelper.unflattenNavigation(selectNavigationAll(appState));

		dispatch(setNavigation(FuseNavigationHelper.updateNavItem(navigation, id, item)));

		return Promise.resolve();
	};

// Remove a navigation item
export const removeNavigationItem =
	(id: string): AppThunk =>
	async (dispatch, getState) => {
		const appState = getState();
		const navigation = FuseNavigationHelper.unflattenNavigation(selectNavigationAll(appState));

		dispatch(setNavigation(FuseNavigationHelper.removeNavItem(navigation, id)));

		return Promise.resolve();
	};

// Redux Selectors for Navigation
export const {
	selectAll: selectNavigationAll,
	selectIds: selectNavigationIds,
	selectById: selectNavigationItemById
} = navigationAdapter.getSelectors<RootState>((state) => state.navigation);

// Create Redux Slice
export const navigationSlice = createSlice({
	name: 'navigation',
	initialState,
	reducers: {
		setNavigation(state, action: PayloadAction<FuseNavItemType[]>) {
			return navigationAdapter.setAll(state, FuseNavigationHelper.flattenNavigation(action.payload));
		},
		resetNavigation: () => initialState
	}
});

export const { setNavigation, resetNavigation } = navigationSlice.actions;

export type navigationSliceType = typeof navigationSlice;

export default navigationSlice.reducer;
