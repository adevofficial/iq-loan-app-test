import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Button } from 'rsuite';

import { toggleModel } from './../store/slices/model.slice';
import get from 'lodash/get';

export default function FormModelCreate(modelName, title, size = 'md') {
  class FormModel extends React.Component {
    static defaultProps = {
      type: 'create',
      submitForm: () => {},
      submitWithData: false,
      metaData: {
        create: {
          title: `New ${title}`,
          submitLabel: 'Create',
          cancelLabel: 'Cancel',
        },
        edit: {
          title: `Edit ${title}`,
          submitLabel: 'Save',
          cancelLabel: 'Cancel',
        },
        delete: {
          title: `Delete ${title}`,
          submitLabel: 'Yes',
          cancelLabel: 'No',
        },
      },
    };

    handleModel = () => {
      this.props.toggleModel(modelName);
    };

    render() {
      const {
        type,
        status,
        submitWithData,
        submitForm,
        data,
        metaData,
        children,
      } = this.props;
      return (
        <div>
          <Modal show={status} onHide={this.handleModel} size={size}>
            <Modal.Header>
              <Modal.Title>{metaData[type].title}</Modal.Title>
            </Modal.Header>
            <Modal.Body className='t-mt-4'>{children(data)}</Modal.Body>
            <Modal.Footer>
              <Button
                onClick={() => {
                  submitWithData ? submitForm(data) : submitForm();
                  this.props.toggleModel(modelName);
                }}
                appearance='primary'
              >
                {metaData[type].submitLabel}
              </Button>
              <Button onClick={this.handleModel} appearance='subtle'>
                {metaData[type].cancelLabel}
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      );
    }
  }

  const mapStateToProps = (state) => ({
    data: get(state, `model.${modelName}.data`),
    type: get(state, `model.${modelName}.data.type`, 'create'),
    status: get(state, `model.${modelName}.status`),
  });

  const mapDispatchToProps = {
    toggleModel,
  };

  return connect(mapStateToProps, mapDispatchToProps)(FormModel);
}
