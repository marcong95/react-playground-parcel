import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, Card, Dot, Tag, Progress, Text } from '@zeit-ui/react'
import styles from './uploader.module.styl'

console.log(styles)

const PlusIcon = ({
  style = { color: '#000' }
}) => <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" shapeRendering="geometricPrecision" style={style}>
  <path d="M12 5v14"/>
  <path d="M5 12h14"/>
</svg>
PlusIcon.propTypes = {
  style: PropTypes.object
}

export const FileListItem = ({
  file,
  type = 'default'
}) => {
  return <Dot type={type}
    className={styles.fileListItem}>
    <Text span
      small
      style={{
        marginRight: '0.5em'
      }}>{file.name}</Text>
    <Tag>{file.type}</Tag>
  </Dot>
}
FileListItem.propTypes = {
  file: PropTypes.object,
  type: PropTypes.string
}

export default class FileUploader extends Component {
  static defaultProps = {
    title: 'File Uploader'
  }

  static propTypes = {
    title: PropTypes.string
  }

  constructor(props) {
    super(props)

    this.fileInput = React.createRef()

    this.state = {
      data: []
    }
  }

  render() {
    const { title } = this.props
    const { data } = this.state

    return (
      <Card>
        <div className="uploader-title">
          <Text h3>{title}</Text>
          <Button auto
            size="small"
            onClick={this.browse}>
            <PlusIcon style={{ marginRight: '0.25em' }} /> Browse
          </Button>
        </div>

        {data.map(file =>
          <FileListItem key={file.name}
            file={file}
            type="default" />)}

        <form name="fileForm"
          style={{ display: 'none' }}>
          <input type="file"
            accept="image/*"
            multiple
            ref={this.fileInput}
            onChange={this.fileChange} />
        </form>
      </Card>
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
