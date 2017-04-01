import React from 'react';
import _ from 'lodash';
import {WidthProvider} from 'react-grid-layout';
import {responsive} from '../config';

export function sortBreakpoints(breakpoints) {
  const keys = Object.keys(breakpoints);
  return keys.sort(function (a, b) {
    return breakpoints[a] - breakpoints[b];
  });
}

export function getBreakpointFromWidth(breakpoints, width) {
  const sorted = sortBreakpoints(breakpoints);
  let matching = sorted[0];

  for (let i = 1, len = sorted.length; i < len; i++) {
    const breakpointName = sorted[i];
    if (width > breakpoints[breakpointName]) matching = breakpointName;
  }

  return matching;
}

export function HeightProvider(ComposedComponent) {
  return props => {
    props = {...responsive, ...props};
    const {cols, margin, breakpoints, width} = props;
    const currentBreakpoint = getBreakpointFromWidth(breakpoints, width);
    props.rowHeight =
      (width - (margin[0] * (cols[currentBreakpoint] + 1))) / cols[currentBreakpoint];

    return <ComposedComponent {...props} />;
  };
}

export function FontSizeProvider(ComposedComponent) {
  return ({style, ...props}) => {
    const fontSize = 16 * props.rowHeight / 150;
    props.style = _.assign(style, {fontSize});

    return <ComposedComponent {...props} />;
  };
}

export const SizeProvider = _.flow([FontSizeProvider, HeightProvider, WidthProvider]);
