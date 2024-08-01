'use client';

import React from 'react';
import useStore from "../_utils/redux";
import {Loading, SearchTags, TagsList, PaginationBox} from '../_components';
import {getAllTags} from '../_serverActions/tags/actions';
import {setGetAllTagsLoading, setGetAllTagsData} from '../_features/tags/tagsSlice';
import debounce from '../_utils/debounce';

const TagsPage: React.FunctionComponent = () => {
    const dispatch = useStore().dispatch;
    const {getAllTagsLoading, getAllTagsData} = useStore().selector.tags;
    const [initialRender, setInitialRender] = React.useState<boolean>(true);
    const debouncedFetchAllTags = React.useCallback(
        debounce(async (search: string) => {
            dispatch(setGetAllTagsLoading(true));
            const data = await getAllTags({
                search,
                pageValue: String(getAllTagsData.pageValue),
                limitValue: String(getAllTagsData.limitValue)
            });
            dispatch(setGetAllTagsData(data));
            dispatch(setGetAllTagsLoading(false));
        }, 250), // Adjust delay as needed
        [dispatch, getAllTagsData.pageValue, getAllTagsData.limitValue]
    );
    const fetchAllTags = async() => {
        const data = await getAllTags({
            search: getAllTagsData.search,
            pageValue: String(getAllTagsData.pageValue),
            limitValue: String(getAllTagsData.limitValue)
        });
        // Set to All Questions Data
        dispatch(setGetAllTagsData(data));
        dispatch(setGetAllTagsLoading(false));
    }
    React.useEffect(() => {
        if (initialRender) {
            fetchAllTags();
            setInitialRender(currentState => {
                return false;
            });
            return;
        }
        debouncedFetchAllTags(getAllTagsData.search);
    }, [getAllTagsData.search, getAllTagsData.pageValue]);
    return (
        <div>
            <SearchTags/>
            {getAllTagsLoading ? (
                <Loading title='Loading All Tags' position='normal' marginTop='1rem'/>
            ) : (
                <>
                    <TagsList data={getAllTagsData.tags} totalTags={Number(getAllTagsData.totalTags)}/>
                    {Number(getAllTagsData.numberOfPages) > 1 && (
                        <PaginationBox pageValue={getAllTagsData.pageValue} numberOfPages={Number(getAllTagsData.numberOfPages)} setData={setGetAllTagsData}/>
                    )}
                </>
            )}
        </div>
    );
}

export default TagsPage;