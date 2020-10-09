import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Button, Card, Dot, Tag, Progress, Text } from '@zeit-ui/react'
import { Plus, Upload } from '@zeit-ui/react-icons'

import axios from 'axios'

const MarginedPlus = styled(Plus)`
  margin-right: 0.25em;
`

const StyledText = styled(Text)``
const FileListHeader = styled.div`
  display: flex;
  align-items: baseline;

  & > ${StyledText} {
    flex: 1;
  }
`

const FileListItemDot = styled(Dot)`
  display: flex !important;

  & + & {
    margin-top: 0.5em;
  }

  * {
    text-transform: none !important;
  }
`
const FileListItemText = styled(Text)`
  margin-right: 0.5em;
`
const FileListItemButton = styled(Button)`
  margin-left: 0.5em;
`
const FileListItemProgress = styled(Progress)`
  display: inline-block;
  width: 100px !important;
  margin-left: 0.5em;
`

export const FileListItem = ({
  file,
  progress,
  type = 'default',
  upload
}) => {
  return <FileListItemDot type={type}>
    <FileListItemText span
      small>{file.name}</FileListItemText>
    <Tag>{file.type}</Tag>
    {progress
      ? <FileListItemProgress value={progress.loaded}
        max={progress.total}
        type={progress.loaded < progress.total ? 'default' : 'success'} />
      : <FileListItemButton auto
        size="mini"
        onClick={upload}>
        <Upload size={12} />
      </FileListItemButton>}
  </FileListItemDot>
}
FileListItem.propTypes = {
  file: PropTypes.object,
  progress: PropTypes.object,
  type: PropTypes.string,
  upload: PropTypes.func
}

export default class FileUploader extends Component {
  static defaultProps = {
    title: 'File Upload'
  }

  static propTypes = {
    title: PropTypes.string
  }

  constructor(props) {
    super()

    this.fileInput = React.createRef()

    this.state = {
      data: [],
      progress: {}
    }
  }

  render() {
    const { title } = this.props
    const { data, progress } = this.state

    return (
      <Card>
        <FileListHeader>
          <StyledText h3>{title}</StyledText>
          <Button auto
            size="small"
            onClick={this.browse}>
            <MarginedPlus size={12} /> Browse
          </Button>
        </FileListHeader>

        {data.map(file =>
          <FileListItem key={file.name}
            file={file}
            progress={progress[file.name]}
            type="default"
            upload={() => this.uploadOne(file)} />)}

        <form name="fileForm"
          style={{ display: 'none' }}>
          <input type="file"
            name="file"
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

  uploadOne = file => {
    console.log(file)

    const formData = new FormData()
    formData.append('file', file)

    axios.post('http://localhost:4321', formData, {
      onUploadProgress: progress => {
        const { loaded, total } = progress
        this.setState({
          progress: {
            ...this.state.progress,
            [file.name]: { loaded, total }
          }
        })
      }
    })

    this.setState({
      progress: {
        ...this.state.progress,
        [file.name]: { loaded: 0, total: file.size }
      }
    })
  }
}
