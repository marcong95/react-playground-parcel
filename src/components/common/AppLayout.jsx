import React, { Component } from 'react'
import { Row, Col, Text } from '@zeit-ui/react'

import FileUploader from '../uploader/FileUploader'

export default class AppLayout extends Component {
  render() {
    return (
      <div>
        {/* header */}
        <Row>
          <Col>
            <Text p
              style={{ textAlign: 'center' }}>Header</Text>
          </Col>
        </Row>

        <Row>
          <Col span={8}>
            <Text>Navigation</Text>
          </Col>
          <Col>
            <FileUploader />
          </Col>
        </Row>

        {/* footer */}
        <Row>
          <Col>
            <Text p
              style={{ textAlign: 'center' }}>Footer</Text>
          </Col>
        </Row>
      </div>
    )
  }
}
