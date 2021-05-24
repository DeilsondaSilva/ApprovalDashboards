/* eslint-disable @typescript-eslint/camelcase */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../../redux_setup/store';
import { groupsTableItemId } from '../../../config';
import PortalItem from 'esri/portal/PortalItem';
import FeatureLayer from 'esri/layers/FeatureLayer';

export type GroupType = {
    groupName: string;
    groupId: string;
    type: string;
};

const initialState: Array<GroupType> = [];

export const fetchGroups = createAsyncThunk(
    'groups/fetchGroups',
    async (): Promise<Array<GroupType>> => {
        const GROUPS_TABLE_ITEM = new PortalItem({
            id: groupsTableItemId,
        });

        await GROUPS_TABLE_ITEM.load();

        const GROUPS_TABLE: FeatureLayer = new FeatureLayer({
            url: GROUPS_TABLE_ITEM.url,
        });
        const QUERY = GROUPS_TABLE.createQuery();

        QUERY.where = '1=1';
        QUERY.outFields = ['*'];

        const GROUPS_FEATURE_SET = await GROUPS_TABLE.queryFeatures(QUERY);
        const GROUPS_FEATURES = GROUPS_FEATURE_SET.features;

        const GROUPS = GROUPS_FEATURES.filter(group => {
            const GROUP_ID = group.attributes.group_id;
            return GROUP_ID != null && GROUP_ID.length === 32;
        }).map((group, idx) => {
            const {
                attributes: { group_name, group_id, type },
            } = group;

            return {
                key: idx,
                groupId: group_id,
                groupName: group_name ? group_name : '',
                type,
            };
        });

        return GROUPS;
    },
);

const groupsSlice = createSlice({
    name: 'groups',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(fetchGroups.fulfilled, (state, action) => {
            return action.payload;
        });
    },
});

export const selectAllGroups = (state: RootState) => state.groups;

export default groupsSlice.reducer;
