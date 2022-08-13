/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react';

// Ours
import ItemList from './atoms/ItemList';

export default function AssetApp(props) {
  // const [value, setValue] = React.useState(0);

  return <ItemList {...props} />;
}
