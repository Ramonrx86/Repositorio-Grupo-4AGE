/* eslint-disable curly */
import { FlashList as SPFlashList, MasonryFlashList as SPMasonaryFlashList, } from '@shopify/flash-list';
import React from 'react';
import { ScrollView as SheetScrollView } from './ScrollView';
function $FlashList(props, ref) {
    return (<SPFlashList {...props} ref={ref} bounces={false} renderScrollComponent={SheetScrollView}/>);
}
export var FlashList = React.forwardRef($FlashList);
function $MasonaryFlashList(props, ref) {
    return (<SPMasonaryFlashList {...props} ref={ref} bounces={false} renderScrollComponent={SheetScrollView}/>);
}
export var MasonaryFlashList = React.forwardRef($MasonaryFlashList);
