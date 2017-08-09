// @flow

import axios from 'axios';
import config from 'config';

import type { Items, ItemStats, Skins } from 'flowTypes';
import type { EmbedProps } from 'embeds/bootstrap';

import { Component } from 'react';
import { connect } from 'react-redux';

import actions from 'features/Gw2/actions';
import Item from 'common/components/Item';
import applyAttributes from 'lib/gw2/itemStats';

import styles from './styles.less';

function mapStateToProps (state) {
  return {
    items: state.items,
    itemStats: state.itemStats,
    skins: state.skins,
  };
}

type Props = {
  items?: Items,
  itemStats?: ItemStats,
  fetchItems?: (ids: Array<number>) => void,
  fetchItemStats?: (ids: Array<number>) => void,
  skins?: Skins,
  ids: Array<number>,
  mode?: 'rune' | 'item',
  statIds: { [key: number]: number },
} & EmbedProps;

@connect(mapStateToProps, {
  fetchItems: actions.fetchItems,
  fetchItemStats: actions.fetchItemStats,
})
export default class ItemsEmbed extends Component {
  props: Props;

  static renderItem (
    id,
    mode,
    statId,
    skinId,
    items,
    itemStats,
    skins,
    blankText,
    index,
    size,
  ) {
    if (id < 0) {
      return <Item key={`${index}-${id}`} tooltipTextOverride={blankText} size={size} />;
    }

    const selectedStat = statId && itemStats && itemStats[statId];
    const item = items && items[id];
    if (!item) {
      return null;
    }

    // TODO: Move this into a custom reducer.
    // See: https://github.com/madou/armory-react/issues/243
    if (selectedStat && item.details && !item.details.infix_upgrade_applied) {
      const attributes = applyAttributes(item, selectedStat);

      item.name = `${selectedStat.name} ${item.name}`;
      item.details.infix_upgrade = {
        id: selectedStat.id,
        attributes,
      };
      item.details.infix_upgrade_applied = true;
    }

    let skin = null;

    if (skinId) {
      axios.get(`${config.gw2.endpoint}v2/skins?ids=${skinId}`)
           .then((data) => {
             skin = data.data[0];
           });
    }

    return (
      <Item
        key={`${index}-${id}`}
        item={item}
        skin={skin === null ? undefined : skin}
        stats={item.stats}
        name={mode === 'rune' ? 'Rune' : undefined}
        tooltipType={mode === 'rune' ? 'amulets' : undefined}
        className={styles.item}
        size={size}
      />
    );
  }

  componentWillMount () {
    const { ids, statIds, fetchItems, fetchItemStats } = this.props;

    fetchItems && fetchItems(ids);
    fetchItemStats && fetchItemStats(Object.values(statIds).map((id) => +id));
  }

  render () {
    const { ids, statIds, skinIds, items, itemStats, skins, className, mode, blankText, size } = this.props;

    return (
      <div className={className}>
        {ids.map((id, index) => ItemsEmbed.renderItem(
          id,
          mode,
          statIds[id],
          skinIds[id],
          items,
          itemStats,
          skins,
          blankText,
          index,
          size,
        ))}
      </div>
    );
  }
}
