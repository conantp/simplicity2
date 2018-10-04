import React from 'react';
import PropTypes from 'prop-types';
// import DataModal from './DataModal';
import HierarchicalSelect from './HierarchicalSelect';
import GranularDash from './GranularDash';
import StatusDash from './StatusDash';
import {
  dateDisplayOptsFuncMaker,
  getIncludedDates,
 } from './granularUtils';


class VolumeDataReceivers extends React.Component {
  constructor(props) {
    super(props);

    // this.onModalOpen = this.onModalOpen.bind(this);
    // this.onModalClose = this.onModalClose.bind(this);
    this.state = {
      selectedData: this.props.data,
      selectedNodes: null,
      selectedHierarchyLevel: null,
      // modalData: null,
    };

    this.onHierarchySelect = this.onHierarchySelect.bind(this);
  }

  // onModalClose() {
  //   this.setState({
  //     modalData: null
  //   })
  // }
  //
  // onModalOpen(inputData) {
  //   this.setState({
  //     modalData: inputData
  //   })
  // }

  onHierarchySelect(selectedData, selectedNodes, selectedHierarchyLevel) {
    this.setState({
      selectedData,
      selectedNodes,
      selectedHierarchyLevel,
    });
  }

  render() {
    const timeFormatter = dateDisplayOptsFuncMaker(this.props.timeSpan);
    const includedDates = getIncludedDates(this.props.timeSpan);
    const whichDash = this.props.location.pathname
      .split('/development')[1]
      .split('_volume')[0]
      .replace('/', '')

    let annotations = [
      {
        depth: 1,
        key: 'Module',
        type: 'custom',
      },
      {
        depth: 2,
        key: 'Type',
        type: 'custom',
      },
      {
        depth: 3,
        key: 'Subtype',
        type: 'custom',
      },
      {
        depth: 4,
        key: 'Category',
        type: 'custom',
      },
    ]
    let hierarchyOrder = [
      'permit_group',
      'permit_type',
      'permit_subtype',
      'permit_category',
    ]
    if (this.props.module === 'planning') {
      annotations = annotations.slice(0, -1)
      hierarchyOrder = hierarchyOrder.slice(0, -1)
    }

    return (<div className="dashRows">
      {/* {this.state.modalData && <DataModal
        data={this.state.modalData}
        closeModal={this.onModalClose}
      />} */}
      <div
        className="row col-md-12"
      >
        <HierarchicalSelect
          data={this.props.data}
          onFilterSelect={this.onHierarchySelect}
          activeDepth={2}
          annotations={annotations}
          hierarchyOrder={hierarchyOrder}
        />
      </div>
      {whichDash === 'granular' &&
        <GranularDash
          {...this.props}
          selectedNodes={this.state.selectedNodes}
          selectedData={this.state.selectedData}
          timeFormatter={timeFormatter}
          includedDates={includedDates}
        />
      }
      {whichDash === 'status' &&
        <StatusDash
          {...this.props}
          selectedNodes={this.state.selectedNodes}
          timeFormatter={timeFormatter}
          includedDates={includedDates}
        />
      }
    </div>);
  }
}

export default VolumeDataReceivers;
