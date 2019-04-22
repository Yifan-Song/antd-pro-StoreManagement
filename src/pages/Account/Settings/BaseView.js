import React, { Component, Fragment } from 'react';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import { Form, Input, Upload, Select, Button } from 'antd';
import { connect } from 'dva';
import styles from './BaseView.less';
import GeographicView from './GeographicView';
import PhoneView from './PhoneView';
// import { getTimeDistance } from '@/utils/utils';

const FormItem = Form.Item;
const { Option } = Select;

// 头像组件 方便以后独立，增加裁剪之类的功能
const AvatarView = ({ avatar }) => (
  <Fragment>
    <div className={styles.avatar_title}>
      <FormattedMessage id="app.settings.basic.avatar" defaultMessage="Avatar" />
    </div>
    <div className={styles.avatar}>
      <img src={avatar} alt="avatar" />
    </div>
    <Upload fileList={[]}>
      <div className={styles.button_view}>
        <Button icon="upload">
          <FormattedMessage id="app.settings.basic.change-avatar" defaultMessage="Change avatar" />
        </Button>
      </div>
    </Upload>
  </Fragment>
);

const validatorGeographic = (rule, value, callback) => {
  const { province, city } = value;
  if (!province.key) {
    callback('Please input your province!');
  }
  if (!city.key) {
    callback('Please input your city!');
  }
  callback();
};

const validatorPhone = (rule, value, callback) => {
  const values = value.split('-');
  if (!values[0]) {

    callback('Please input your area code!');
  }
  if (!values[1]) {
    callback('Please input your phone number!');
  }
  callback();
};

@connect(({ user }) => ({
  currentUser: user.currentUser,
}))
@Form.create()
class BaseView extends Component {
  componentDidMount() {
    this.setBaseInfo();
    this.getId()
  }

  setBaseInfo = () => {
    const { currentUser, form } = this.props;
    Object.keys(form.getFieldsValue()).forEach(key => {
      const obj = {};
      obj[key] = currentUser[key] || null;
      form.setFieldsValue(obj);
    });
  };

  getAvatarURL() {
    const { currentUser } = this.props;
    const url = 'http://img0.imgtn.bdimg.com/it/u=2199874239,1645435041&fm=26&gp=0.jpg';
    return url;
  }

  getViewDom = ref => {
    this.view = ref;
  };

  getId = () =>{
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
                  console.log("Store fetched:")
                  this.setState({addressId : result[5]["address"]["id"]})
                  this.setState({storeId : result[5]["id"]})
              }
          )
    }
  
  handleSubmit = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log(values)
        var json = {};
        var address = {}
        json['id'] = 0
        json['image'] = ""
        json['storename'] = values['storename']
        json['description'] = values['storenamedesc']
        address['address'] = values['geographic']['province']['label']+values['geographic']['city']['label']+ values['address']
        address['geohash'] = ""
        address['id'] = this.state.addressId
        address['latitude'] = 0
        address['longtitude'] = 0
        json['address'] = address
        fetch("http://pipipan.cn:1000/api/v1/Store/"+this.state.storeId+"?updateAddress=true", {
              method: 'PUT',
              credentials: 'include',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=utf-8'
              },
              body: JSON.stringify(json)
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
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <div className={styles.baseView} ref={this.getViewDom}>
        <div className={styles.left}>
          <Form layout="vertical" onSubmit={this.handleSubmit} hideRequiredMark>
            <FormItem label="店铺名称">
              {getFieldDecorator('storename', {
                rules: [
                  {
                    required: true,
                    message: "请输入店铺名称",
                  },
                ],
              })(<Input />)}
            </FormItem>

            <FormItem label="店铺介绍">
              {getFieldDecorator('storenamedesc', {
                rules: [
                  {
                    required: true,
                    message: "请输入店铺介绍",
                  },
                ],
              })(
                <Input.TextArea
                  placeholder="请输入店铺介绍"
                  rows={4}
                />
              )}
            </FormItem>

            <FormItem label={formatMessage({ id: 'app.settings.basic.country' })}>
              {getFieldDecorator('country', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'app.settings.basic.country-message' }, {}),
                  },
                ],
              })(
                <Select style={{ maxWidth: 220 }}>
                  <Option value="China">中国</Option>
                </Select>
              )}
            </FormItem>
            <FormItem label={formatMessage({ id: 'app.settings.basic.geographic' })}>
              {getFieldDecorator('geographic', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'app.settings.basic.geographic-message' }, {}),
                  },
                  {
                    validator: validatorGeographic,
                  },
                ],
              })(<GeographicView />)}
            </FormItem>
            <FormItem label={formatMessage({ id: 'app.settings.basic.address' })}>
              {getFieldDecorator('address', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'app.settings.basic.address-message' }, {}),
                  },
                ],
              })(<Input />)}
            </FormItem>
            
            <FormItem label={formatMessage({ id: 'app.settings.basic.phone' })}>
              {getFieldDecorator('phone', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'app.settings.basic.phone-message' }, {}),
                  },
                  { validator: validatorPhone },
                ],
              })(<Input />)}
            </FormItem>

            <Button type="primary" htmlType="submit">
              <FormattedMessage
                id="app.settings.basic.update"
                defaultMessage="Update Information"
              />
            </Button>
          </Form>
        </div>
        <div className={styles.right}>
          <AvatarView avatar={this.getAvatarURL()} />
        </div>
      </div>
    );
  }
}

export default BaseView;
