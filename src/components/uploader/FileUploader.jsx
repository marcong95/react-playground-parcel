import React, { Component } from 'react'
import { Button, Dot, Tag, Progress, Table, Text } from '@zeit-ui/react'

// const progress = (actions, rowData) => {
//   return <Progress value={rowData.rowValue.progressValue}/>
// }

const PlusIcon = props => {
  const { style } = props
  Object.assign(style, {
    color: '#000'
  })
  return <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" shapeRendering="geometricPrecision" style={style}><path d="M12 5v14"/><path d="M5 12h14"/></svg>
}

export default class FileUploader extends Component {
  constructor(props) {
    super(props)

    this.fileInput = React.createRef()

    this.state = {
      data: []
    }
  }

  render = () => {
    const { data } = this.state

    return (
      <div>
        <form name="fileForm"
          style={{ display: 'none' }}>
          <input type="file"
            accept="image/*"
            multiple
            ref={this.fileInput}
            onChange={this.fileChange} />
        </form>

        {/* <Table className="table-body-scrollable"
          data={data}>
          <Table.Column prop="name" label="Name" />
          <Table.Column prop="type" label="Type" />
          <Table.Column prop="progress"
            label="Progress"
            width={120} />
          <Table.Column prop="arrange"
            label="Arrange"
            width={50}>
            <Button auto
              size="mini"
              style={{ padding: '0 0.3125rem' }}
              onClick={this.browse}>
              <PlusIcon style={{ marginTop: '1px' }} />
            </Button>
          </Table.Column>
        </Table> */}

        <Button auto
          size="small"
          onClick={this.browse}>
          <PlusIcon style={{ marginRight: '0.25em' }} /> Browse
        </Button>

        {data.map(file => {
          const dotType = 'default'
          return <Dot key={file.name}
            type={dotType}
            className="file-list-item">
            <Text span
              small
              style={{
                marginRight: '0.5em',
              }}>{file.name}</Text>
            <Tag>{file.type}</Tag>
          </Dot>
        })}
      </div>
    )
  }

  browse = () => {
    const el = this.fileInput.current
    el.dispatchEvent(new MouseEvent('click'))
  }

  fileChange = e => {
    console.log(e.target.files)
    this.setState({
      data: Array.from(e.target.files)
    })
  }
}
