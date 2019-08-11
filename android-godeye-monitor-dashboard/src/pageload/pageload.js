import React, {Component} from 'react';
import '../App.css';

import Highcharts from '../../node_modules/highcharts/highcharts';
import exporting from '../../node_modules/highcharts/modules/exporting';
import {Card, Badge, Button, Tag} from 'antd'
import Util from "../libs/util";

exporting(Highcharts);

/**
 * Pageload
 */
class Pageload extends Component {
    static BAD_DRAW_TIME = 800;
    static BAD_LOAD_TIME = 2000;

    constructor(props) {
        super(props);
        this.handleFollow = this.handleFollow.bind(this);
        this.handleUnfollow = this.handleUnfollow.bind(this);
        this.handleClear = this.handleClear.bind(this);
        this.allPageLifecycleProcessedEvents = [];
        this.state = {
            show: false,
            followPageLifecycleProcessedEvent: null,
            renderPageLifecycleProcessedEvents: []
        };
    }

    static isSamePageClass(pageLifecycleProcessedEvent1, pageLifecycleProcessedEvent2) {
        if (pageLifecycleProcessedEvent1 && pageLifecycleProcessedEvent2) {
            return pageLifecycleProcessedEvent1.pageType === pageLifecycleProcessedEvent2.pageType
                && pageLifecycleProcessedEvent1.pageClassName === pageLifecycleProcessedEvent2.pageClassName
        }
        return false;
    }

    static findThisPageLifecycleEvents(pageLifecycleProcessedEvents, pageLifecycleProcessedEvent) {
        if (pageLifecycleProcessedEvent) {
            const thisPageLifecycleEvents = [];
            pageLifecycleProcessedEvents.forEach((item) => {
                if (Pageload.isSamePageClass(item, pageLifecycleProcessedEvent)) {
                    thisPageLifecycleEvents.push(item)
                }
            });
            return thisPageLifecycleEvents;
        }
        return pageLifecycleProcessedEvents;
    }

    refresh(pageLifecycleProcessedEvent) {
        this.allPageLifecycleProcessedEvents.unshift(pageLifecycleProcessedEvent);
        this.setState({
            renderPageLifecycleProcessedEvents: Pageload.findThisPageLifecycleEvents(this.allPageLifecycleProcessedEvents, this.state.followPageLifecycleProcessedEvent)
        });
    }

    handleFollow(pageLifecycleProcessedEvent) {
        this.setState({
            followPageLifecycleProcessedEvent: pageLifecycleProcessedEvent,
            renderPageLifecycleProcessedEvents: Pageload.findThisPageLifecycleEvents(this.allPageLifecycleProcessedEvents, pageLifecycleProcessedEvent)
        });
    }

    handleUnfollow() {
        this.setState({
            followPageLifecycleProcessedEvent: null,
            renderPageLifecycleProcessedEvents: Pageload.findThisPageLifecycleEvents(this.allPageLifecycleProcessedEvents, null)
        });
    }

    handleClear() {
        this.allPageLifecycleProcessedEvents = [];
        this.setState({
            renderPageLifecycleProcessedEvents: []
        });
    }

    renderTimelines(pageLifecycleProcessedEvents) {
        if (pageLifecycleProcessedEvents) {
            let items = [];
            for (let i = 0; i < pageLifecycleProcessedEvents.length; i++) {
                const event = pageLifecycleProcessedEvents[i];
                if (event.lifecycleEvent === 'ON_LOAD') {
                    items.push(<Card style={{margin: 4}} size="small">
                        <Badge
                            color={Util.getGreen()}/><span>{`${new Date(event.eventTimeMillis).toLocaleString()}.${event.eventTimeMillis % 1000}`}</span>
                        <br/>
                        <span>&nbsp;&nbsp;&nbsp;&nbsp;
                            <strong>{`${event.pageClassName}`}</strong>{`@${event.pageHashCode}`}<Button
                                type="link"
                                onClick={() => {
                                    this.handleFollow(event);
                                }
                                }>Follow This Class of Page</Button>
                         </span>
                        <br/>
                        <span>&nbsp;&nbsp;&nbsp;&nbsp;
                            <Tag color="cyan">{event.pageType}</Tag>
                            <Tag color="geekblue">{event.lifecycleEvent}</Tag>
                            Load cost <strong
                                style={(event.processedInfo['loadTime'] > Pageload.BAD_LOAD_TIME) ? {color: Util.getRed()} : {color: Util.getGreen()}}>{event.processedInfo['loadTime']}</strong> ms
                        </span>
                    </Card>);
                } else if (event.lifecycleEvent === 'ON_DRAW') {
                    items.push(<Card style={{margin: 4}} size="small">
                        <Badge
                            color={Util.getGreen()}/><span>{`${new Date(event.eventTimeMillis).toLocaleString()}.${event.eventTimeMillis % 1000}`}</span>
                        <br/>
                        <span>&nbsp;&nbsp;&nbsp;&nbsp;
                            <strong>{`${event.pageClassName}`}</strong>{`@${event.pageHashCode}`}<Button
                                type="link"
                                onClick={() => {
                                    this.handleFollow(event);
                                }
                                }>Follow This Class of Page</Button>
                        </span>
                        <br/>
                        <span>&nbsp;&nbsp;&nbsp;&nbsp;
                            <Tag color="cyan">{event.pageType}</Tag>
                            <Tag color="geekblue">{event.lifecycleEvent}</Tag>
                            Draw cost <strong
                                style={(event.processedInfo['drawTime'] > Pageload.BAD_DRAW_TIME) ? {color: Util.getRed()} : {color: Util.getGreen()}}>{event.processedInfo['drawTime']}</strong> ms
                        </span>
                    </Card>);
                } else {
                    items.push(<Card style={{margin: 4}} size="small">
                        <Badge
                            color={Util.getGreen()}/><span>{`${new Date(event.eventTimeMillis).toLocaleString()}.${event.eventTimeMillis % 1000}`}</span>
                        <br/>
                        <span>&nbsp;&nbsp;&nbsp;&nbsp;
                            <strong>{`${event.pageClassName}`}</strong>{`@${event.pageHashCode}`}<Button
                                type="link"
                                onClick={() => {
                                    this.handleFollow(event);
                                }
                                }>Follow This Class of Page</Button>
                        </span>
                        <br/>
                        <span>&nbsp;&nbsp;&nbsp;&nbsp;
                            <Tag color="cyan">{event.pageType}</Tag>
                            <Tag color="geekblue">{event.lifecycleEvent}</Tag>
                        </span>
                    </Card>);
                }
            }
            return items;
        }
    }

    renderTip(followClass) {
        if (followClass) {
            return (<div><span>Current Following Page: [{followClass}]&nbsp;&nbsp;</span>
                <Button onClick={this.handleUnfollow}>Unfollow</Button> <Button
                    onClick={this.handleClear}>Clear</Button></div>)
        }
        return <Button onClick={this.handleClear}>Clear</Button>
    }

    render() {
        let followClass;
        if (this.state.followPageLifecycleProcessedEvent) {
            followClass = this.state.followPageLifecycleProcessedEvent.pageClassName
        }
        return (
            <Card title="Page Lifecycle(页面生命周期)" extra={this.renderTip(followClass)}>
                <div style={{height: 670, overflow: 'auto'}}>
                    {this.renderTimelines(this.state.renderPageLifecycleProcessedEvents)}
                </div>
            </Card>);
    }
}

export default Pageload;
