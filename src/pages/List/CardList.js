import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Button, Icon, List } from 'antd';

import Ellipsis from '@/components/Ellipsis';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './CardList.less';

@connect(({ list, loading }) => ({
  list,
  loading: loading.models.list,
}))

class CardList extends PureComponent {
  constructor(props){
    super(props)
    this.state = {
      goods:[]
    };
    this.getGoods();
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'list/fetch',
      payload: {
        count: 8,
      },
    });
  }

  handleClick = () =>{
    window.location.href="http://localhost:8000/profile/basic"
  }
  
  handleDelete = () =>{
    fetch("http://pipipan.cn:1000/api/v1/Good/store/1555594479362/good/"+this.state.lastGoodId, {
        method: 'DELETE',
        credentials: 'include',
    })
        .then(
            res => res.json()
        )
        .then(
            (result) => {
                console.log(result)
                window.location.href = "http://localhost:8000/result/success"
            }
        )
  }

  handleChange = () =>{
    window.location.href = "http://localhost:8000/form/basic-form"
  }
    
  getGoods = () => {
    fetch("http://pipipan.cn:1000/api/v1/Store", {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
        },
    })
        .then(
            res => res.json()
        )
        .then(
            (result) => {
                console.log("Goods fetched:")
                var goods = result[5]["goods"]
                console.log(goods)
                this.setState({goods:goods})
                this.setState({lastGoodId:goods[goods.length-1]["id"]})
                console.log(this.state)
            }
        )
      }

  render() {
    const {
      list: { list },
      loading,
    } = this.props;

    const content = (
      <div className={styles.pageHeaderContent}>
        <p>
          查看/编辑商品信息
        </p>
      </div>
    );

    const extraContent = (
      <div className={styles.extraImg}>
        <img
          alt="这是一个标题"
          src="http://img0.imgtn.bdimg.com/it/u=2199874239,1645435041&fm=26&gp=0.jpg"
        />
      </div>
    );

    return (
      <PageHeaderWrapper title="商品信息" content={content} extraContent={extraContent}>
        <div className={styles.cardList}>
          <List
            rowKey="id"
            loading={loading}
            grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
            dataSource={this.state.goods}
            renderItem={item =>
              item ? (
                <List.Item key={item.id}>
                  <Card hoverable className={styles.card} actions={[<a onClick = {this.handleChange}>编辑商品</a>, <a onClick = {this.handleDelete}>删除商品</a>]}>
                    <Card.Meta
                      avatar={<img onClick={this.handleClick} alt="" className={styles.cardAvatar} src={"https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3971331597,2029881712&fm=26&gp=0.jpg"} />}
                      title={<a>{item.goodname}</a>}
                      description={
                        <Ellipsis className={styles.item} lines={3}>
                          {item.description}
                        </Ellipsis>
                      }
                    />
                    <div>{"价格："+item.price+"元"}</div>
                  </Card>
                </List.Item>
              ) : (
                <List.Item>
                  <Button type="dashed" className={styles.newButton}>
                    <Icon type="plus" /> 新建产品
                  </Button>
                </List.Item>
              )
            }
          />
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default CardList;
