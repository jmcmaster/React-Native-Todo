import React from 'react';
import { StyleSheet, Text, View, Platform, ListView, Keyboard } from 'react-native';
import Header from './components/Header';
import Footer from './components/Footer';
import Row from './components/Row';

export default class App extends React.Component {
  constructor(props) {
    super(props)
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 != r2 });
    this.state = {
      allComplete: false,
      value: "",
      items: [],
      dataSource: ds.cloneWithRows([])
    }

    this.handleRemoveItem = this.handleRemoveItem.bind(this);
    this.setSource = this.setSource.bind(this);
    this.handleAddItem = this.handleAddItem.bind(this);
    this.handleToggleComplete = this.handleToggleComplete.bind(this);
    this.handleToggleAllComplete = this.handleToggleAllComplete.bind(this);
  }

  setSource(items, itemDatasource, otherState = {}) {
    this.setState({
      items,
      dataSource: this.state.dataSource.cloneWithRows(itemDatasource),
      ... otherState
    })
  }

  handleToggleAllComplete() {
    const complete = !this.state.allComplete;
    const newItems = this.state.items.map((item) => ({
      ... item,
      complete
    }))
    // console.table(newItems);
    this.setSource(newItems, newItems, { allComplete: complete })
    // this.setState({
    //   items: newItems,
    //   allComplete: complete,
    // })
  }

  handleToggleComplete(key, complete) {
    const newItems = this.state.items.map((item) => {
      if (item.key != key) return item;
      return {
        ... item, 
        complete
      }
    })
    this.setSource(newItems, newItems);
  }

  handleRemoveItem(key) {
    const newItems = this.state.items.filter((item) => {
      return item.key != key
    })
    this.setSource(newItems, newItems);
  }

  handleAddItem() {
    if (!this.state.value) return;
    const newItems = [
      ... this.state.items,
      {
        key: Date.now(),
        text: this.state.value,
        complete: false,
      }
    ];
    this.setSource(newItems, newItems, { value: "" })
    // this.setState({
    //   items: newItems,
    //   value: "",
    // })
  }

  render() {
    return (
      <View style={styles.container}>
        <Header 
          value={this.state.value}
          onAddItem={this.handleAddItem}
          onChange={(value) => this.setState({ value })}
          onToggleAllComplete={this.handleToggleAllComplete}
        />
        <View style={styles.content}>
          <ListView 
            style={styles.list}
            enableEmptySections
            dataSource={this.state.dataSource}
            onScroll={() => Keyboard.dismiss()}
            renderRow={({ key, ... value}) => {
              return (
                <Row 
                  key={key}
                  onComplete={(complete) => this.handleToggleComplete(key, complete)}
                  onRemove={() => this.handleRemoveItem(key)}
                  {... value}
                />
              )
            }}
            renderSeparator={(sectionId, rowId) => {
              return <View key={rowId} style={styles.separator}/>
            }}
          />
        </View>
        <Footer />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    ... Platform.select({
      ios: { paddingTop: 30 }
    })
  },
  content: {
    flex: 1
  },
  list: {
    backgroundColor: "#FFF"
  },
  separator: {
    borderWidth: 1,
    borderColor: "#F5F5F5"
  }
});
