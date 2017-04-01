import React, {Component, PropTypes} from 'react'
import _ from 'lodash';
import {Button} from 'antd';
import {Responsive} from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css'
import s from './style.scss';
import {FontSizeProvider, HeightProvider} from '../../util/layout';

export const responsive = {
  breakpoints: {lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0},
  cols: {lg: 12, md: 10, sm: 6, xs: 4, xxs: 2},
  margin: [10, 10]
};

const ResponsiveGridLayout = _.flow([FontSizeProvider, HeightProvider])(Responsive);

class Layout extends Component {
  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);

    this.state = {
      cards: [],
      width: 1400,
      containerWidth: 0,
      currentBreakpoint: 'lg',
      mounted: false
    };
  }

  componentDidMount() {
    this.setState({mounted: true});
    this.mounted = true;
    window.addEventListener('resize', this.handleWindowResize);
    this.handleWindowResize();
  }

  componentWillUnmount() {
    this.mounted = false;

    window.removeEventListener('resize', this.handleWindowResize);
  }

  handleWindowResize = () => {
    if (!this.mounted) return;

    const containerWidth = this.container.offsetWidth;
    let {width} = this.state;
    if (width >= responsive.breakpoints.lg) width = _.max([responsive.breakpoints.lg, containerWidth]);

    this.setState({
      containerWidth,
      width
    });
  };

  handleBreakpointChange = (currentBreakpoint, currentCols) => {
    this.setState({
      currentBreakpoint,
      currentCols
    });
  };

  handleLayoutChange = (layout, layouts) => {
  };

  handleAddItem = () => {
    const {cards} = this.state;
    const id = `${(_.max(_.map(cards, c => _.parseInt(c.id))) + 1) || 0}`;
    cards.push({
      i: id,
      x: layout.length * 2 % (responsive.cols[breakpoint]),
      y: 99999,
      w: 1,
      h: 1
    });
    this.setState({cards});
  };

  handleEditItem = e => {
    const {id} = e.currentTarget.dataset;
    this.setState({editId: id});
  };

  handleRemoveItem = e => {
    const {id} = e.currentTarget.dataset;
    let {cards} = this.state;
    cards = _.reject(cards, {id});
    this.setState({cards});
  };

  renderGridItem() {
    const {cards} = this.state;
    return _.map(cards, card =>
      (<div key={card.id} className={s.card}>
        <div className={s.toolbox}>
          <span data-id={card.id} onClick={this.handleEditItem}>
            E
          </span>
          {' '}
          <span data-id={card.id} onClick={this.handleRemoveItem}>
            X
          </span>
        </div>
      </div>)
    );
  }

  render() {
    const {width, mounted, cards} = this.state;

    return (<div>
      <div className={s.editorPanel}>
        <Button type="primary" onClick={this.handleAddItem}>添加</Button>
      </div>
      <div ref={ref => (this.container = ref)} className={s.layoutContainer}>
        <ResponsiveGridLayout
          {...responsive}
          style={{width}}
          className={s.layout}
          width={width}
          layouts={cards}
          onBreakpointChange={this.handleBreakpointChange}
          onLayoutChange={this.handleLayoutChange}
          useCSSTransforms={mounted}
        >
          {this.renderGridItem()}
        </ResponsiveGridLayout>
      </div>
    </div>);
  }
}

export default Layout;

