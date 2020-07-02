import React from 'react'
import styled from 'styled-components'
import { Grid, Text } from '@zeit-ui/react'

import { Gauge } from '../visualizer/BarCircular'
import FileUploader from '../uploader/FileUploader'

const AppHeader = styled.div`
  text-align: center;

  h1 {
    font-size: 2em;
    font-weight: normal;
  }
`
const StyledGauge = styled(Gauge)`
  display: inherit;
  margin: 0 auto;
  background: transparent;
`
const CopyrightInfo = styled(Text)`
  display: block;
  color: #ccc !important;
  font-size: 0.875em;
  text-align: center;
`

export default function AppLayout() {
  const thisYear = new Date().getFullYear()

  return (
    <div>
      {/* header */}
      <AppHeader>
        <Text h1>react-playground-parcel</Text>
      </AppHeader>

      <Grid.Container gap={2}>
        <Grid xs={24} md={8}>
          <StyledGauge width={200}
            height={200}
            data={[
              { name: 'cpu', value: 22 },
              { name: 'gpu', value: 33 },
              { name: 'mem', value: 66 },
              { name: 'fps', value: 99 }
            ]}/>
        </Grid>
        <Grid xs={24} md={16}>
          <FileUploader />
        </Grid>
      </Grid.Container>

      {/* footer */}
      <CopyrightInfo>&copy; {thisYear} Marco Ng </CopyrightInfo>
    </div>
  )
}
