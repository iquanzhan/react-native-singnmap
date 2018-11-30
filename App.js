
import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Button, NetInfo, PermissionsAndroid, Alert, NativeModules } from 'react-native';
import { MapView, Marker } from 'react-native-amap3d'

import { Geolocation } from "react-native-amap-geolocation"



export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      location: {},
      isConnected: false
    };
  }

  async componentDidMount() {
    //初始化定位
    await this.initGeolocation();

    //网络权限设置
    this.checkInternet()


  }

  componentWillUnmount() {
    //应用销毁时，停止定位
    Geolocation.stop()
  }

  //region 定位相关设置


  /**
   *询问定位权限
   *
   * @memberof App
   */
  async requestGPSPermission() {
    try {
      const permissions = [
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ]
      //返回得是对象类型
      const granteds = await PermissionsAndroid.requestMultiple(permissions);

      if (granteds["android.permission.ACCESS_FINE_LOCATION"] !== "granted" || granteds["android.permission.ACCESS_COARSE_LOCATION"] !== "granted") {
        Alert.alert('提示', '您未开启定位权限，这将导致无法使用签到功能，是否重新开启定位？',
          [
            { text: "不启用", onPress: () => { console.log('取消') } },
            {
              text: "开启", onPress: async () => {
                await this.requestGPSPermission();
              }
            }
          ]
        );
      }


    } catch (err) {
      alert(err);
    }

  }

  /**
   * 初始化定位
   */
  async initGeolocation() {
    //询问定位权限
    await this.requestGPSPermission();


    //判断GPS是否开启
    NativeModules.getGPSStatus.show((data) => {
      alert(data);

      if (!data) {
        Alert.alert("提示", "请开启GPS定位服务");
      }
    });


    await Geolocation.init({
      android: ""//高德地图token
    })
    Geolocation.setOptions({
      interval: 5000,
      distanceFilter: 10,
      background: true,
      reGeocode: true
    })
    Geolocation.addLocationListener(location =>

      this.updateLocationState(location)
    )
  }

  /**
   *定位更新事件
   * @param {*} location
   * @memberof App
   */
  updateLocationState(location) {
    if (location) {
      location.timestamp = new Date(location.timestamp).toLocaleString();

      let distance = this.getDistance(location.latitude, location.longitude, 39.976476, 116.33996);
      location.distance = distance;

      this.setState({ location })
    }
  }

  /**
   *开始定位
   * @memberof App
   */
  startLocation() {
    Geolocation.start()
  }
  /**
   *结束定位
   * @memberof App
   */
  stopLocation = () => Geolocation.stop()

  /**
   *获取最近一次的定位结果
   * @memberof App
   */
  getLastLocation = async () =>
    this.updateLocationState(await Geolocation.getLastLocation())

  //endregion


  //region 经纬度之间距离计算

  /**
   *获取两个经纬度之间的距离
   * @param {*} lat1
   * @param {*} lng1
   * @param {*} lat2
   * @param {*} lng2
   * @memberof App
   */
  getDistance(lat1, lng1, lat2, lng2) {
    let f = this.getRad((lat1 + lat2) / 2);
    let g = this.getRad((lat1 - lat2) / 2);
    let l = this.getRad((lng1 - lng2) / 2);
    let sg = Math.sin(g);
    let sl = Math.sin(l);
    let sf = Math.sin(f);
    let s, c, w, r, d, h1, h2;
    let a = 6378137.0;//The Radius of eath in meter. 
    let fl = 1 / 298.257;
    sg = sg * sg;
    sl = sl * sl;
    sf = sf * sf;
    s = sg * (1 - sl) + (1 - sf) * sl;
    c = (1 - sg) * (1 - sl) + sf * sl;
    w = Math.atan(Math.sqrt(s / c));
    r = Math.sqrt(s * c) / w;
    d = 2 * w * a;
    h1 = (3 * r - 1) / 2 / c;
    h2 = (3 * r + 1) / 2 / s;
    s = d * (1 + fl * (h1 * sf * (1 - sg) - h2 * (1 - sf) * sg));

    s = s.toFixed(2);//指定小数点后的位数。 
    return s;
  }

  getRad(d) {
    let PI = Math.PI;
    return d * PI / 180.0;
  }

  //endregion


  /**
   *监测网络连接状态
   * @memberof App
   */
  checkInternet() {
    //检测网络是否连接
    NetInfo.isConnected.fetch().done((isConnected) => {
      //alert("检测网络是否连接：" + JSON.stringify(isConnected));
      this.setState({
        isConnected
      })
      if (!isConnected) {
        alert("请连接您的网络");
      }
    });

    //检测网络连接信息
    NetInfo.getConnectionInfo().done((connectionInfo) => {
      //alert("检测网络连接信息：" + JSON.stringify(connectionInfo));
    });

    //监听网络变化事件
    NetInfo.addEventListener('connectionChange', (networkType) => {
      //alert("网络产生变化：" + JSON.stringify({ isConnected: networkType }));
    })
  }

  render() {
    const { location } = this.state
    return (
      <View style={style.body}>
        <View style={style.controls}>
          <Button
            style={style.button}
            onPress={this.startLocation}
            title="开始定位"
          />
          <Button
            style={style.button}
            onPress={this.stopLocation}
            title="停止"
          />
        </View>
        {/*  {Object.keys(location).map(key => (
          <View style={style.item} key={key}>
            <Text style={style.label}>{key}</Text>
            <Text>{location[key]}</Text>
          </View>
       ))} */}

        <View style={style.item}>
          <Text style={style.label}>当前状态：</Text>

        </View>
        <Text numberOfLines={5} style={{ paddingRight: 10 }}>当前位置：{location.address}
        </Text>
        <Text>
          距离签到地点：{location.distance} 米
        </Text>

      </View>
    );
  }
}


const style = StyleSheet.create({
  controls: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 12,
    marginBottom: 24
  },
  item: {
    flexDirection: "row",
    marginBottom: 4
  },
  label: {
    color: "#f5533d",
    paddingRight: 10,
    textAlign: "right"
  }
})
