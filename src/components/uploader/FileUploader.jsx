import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Button, Card, Dot, Tag, Progress, Text } from '@zeit-ui/react'
import { Plus } from '@zeit-ui/react-icons'

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

export const FileListItem = ({
  file,
  type = 'default'
}) => {
  return <FileListItemDot type={type}>
    <FileListItemText span
      small>{file.name}</FileListItemText>
    <Tag>{file.type}</Tag>
  </FileListItemDot>
}
FileListItem.propTypes = {
  file: PropTypes.object,
  type: PropTypes.string
}

export default class FileUploader extends Component {
  static defaultProps = {
    title: 'File Upload'
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
