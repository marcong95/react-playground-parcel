import React, { Component } from 'react'
import styled from 'styled-components'
import { Row, Col, Text } from '@zeit-ui/react'

import { Gauge } from '../visualizer/BarCircular'
import FileUploader from '../uploader/FileUploader'

const StyledGauge = styled(Gauge)`
  display: inherit;
  margin: 0 auto;
  background: transparent;
`

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
            <StyledGauge width={200}
              height={200}
              data={[
                { name: 'cpu', value: 22 },
                { name: 'gpu', value: 33 },
                { name: 'mem', value: 66 },
                { name: 'fps', value: 99 }
              ]}/>
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
