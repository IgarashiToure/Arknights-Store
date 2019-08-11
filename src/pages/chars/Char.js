import React, { Component } from 'react';
import { Chart, Point, Axis, Tooltip, Legend, View, Polygon, Coord, Line } from 'viser-react';

import './Char.scss';

import classNames from 'classnames';

import { handbookDict } from '../../data/original/handbook_info_table.json';
// import infos from '../../data/original/character_table.json';
import simpleInfos from '../../data/char/simples.json';
import phasesInfos from '../../data/char/phases.json';
import { imageMaps } from '../../data/char/images';
import { Layout, Tabs } from '../../components';

export default class Char extends Component {

  static defaultProps = {

  };

  static getDerivedStateFromProps(nextProps) {
    const { match } = nextProps;
    const id = match.params.id;
    const story = handbookDict[id];
    const simpleInfo = simpleInfos.filter(si => si.id === id)[0];
    const phases = phasesInfos.filter(pi => pi.id === id)[0].phases;
    const image = imageMaps[id];

    // scroll to top
    window.scrollTo(0, 0);

    return {
      id,
      story,
      simpleInfo,
      phases,
      image
    };
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  dangerP(text = '', index = -1) {
    const dummy = text.replace(/\n/ig, '<br/>');
    return <p key={index} dangerouslySetInnerHTML={{__html: dummy}} />;
  }

  renderStory(story) {
    const { storyTextAudio } = story;
    return (
      <div className="char-story">
        {storyTextAudio.map((sta, index) => {
          const { storyTitle, stories = [] } = sta;
          return (
            <div className="char-story-item" key={index}>
              <h2 className="char-story-title">{storyTitle}</h2>
              <div className="char-story-content">
                {stories.map((s, index) => this.dangerP(s.storyText, index))}
              </div>
            </div>
          )
        })}
      </div>
    );
  }

  renderLevelChart(phases) {
    const scale = [
      {
        dataKey: 'level',
        type: 'linear',
        alias: '等级',
      },
      {
        dataKey: 'value',
        type: 'linear',
      },
    ];

    const labelMaps = {
      'maxHp': '血量',
      'atk': '攻击力',
      'def': '防御力'
    };

    return (
      <Chart
        forceFit
        height={500}
        scale={scale}
        padding={'auto'}
        animate={true}
        data={phases}
      >
        <Tooltip
          crosshairs={true}
          htmlContent={(value, items) => {
            const title = items[0].point._origin.title;

            const html = '<div class="g2-tooltip">';
            const titleDom = `<div class="g2-tooltip-title" style="margin-bottom: 4px;">${title}</div>`;
            let listDom = '<ul class="g2-tooltip-list">';
            for (let i = 0; i < items.length; i++) {
              var item = items[i];
              var itemDom = `<li data-index={index}>
                <span style="background-color:${item.color};width:8px;height:8px;border-radius:50%;display:inline-block;margin-right:8px;"></span>
                <span class="g2-tooltip-label">${labelMaps[item.name]}</span>
                <span class="g2-tooltip-value">${item.value}</span>
              </li>`;
              listDom += itemDom;
            }

            listDom += '</ul>';
            return html + titleDom + listDom + '</div>';
          }}
        />
        <Axis />
        <Legend />

        <Point position="level*value" color="attr" shape="circle" />
        <Line position="level*value" color="attr" />
      </Chart>
    );
  }

  render() {
    const {
      className,
    } = this.props;

    const { story, simpleInfo, image, phases } = this.state;
    const clazz = classNames('char-detail', className);
    const imageHeight = window.innerHeight - 84;

    return (
      <Layout className={clazz}>
        <Layout.Sider width={650}>
          <h1 className="char-name">{simpleInfo.name}</h1>
          <Tabs>
            <Tabs.Pane key="story" bar="档案">
              {this.renderStory(story)}
            </Tabs.Pane>
            <Tabs.Pane key="tab2" bar="属性">
              {this.renderLevelChart(phases)}
            </Tabs.Pane>
          </Tabs>
        </Layout.Sider>
        <Layout.Content>
          <div className="char-image">
            {image && <img height={imageHeight} src={image} alt="" />}
          </div>
        </Layout.Content>
      </Layout>
    );
  }
}
