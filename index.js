import React, { Component } from 'react'
import classNames from 'classnames'

const DEFAULT_PLACEHOLDER_STRING = 'Select...'

class Dropdown extends Component {
  constructor (props) {
    super(props)
    this.state = {
      selected: props.value || {
        label: props.placeholder || DEFAULT_PLACEHOLDER_STRING,
        value: '',
        display: props.display ? props.display || 'inline-block'
      },
      isOpen: false,
      options: this.props.options || []
    }
    this.mounted = true
    this.fireChangeEvent = this.fireChangeEvent.bind(this)
  }

  componentWillReceiveProps (newProps) {
    if (newProps.value && newProps.value !== this.state.selected) {
      this.setState({selected: newProps.value})
    } else if (!newProps.value && newProps.placeholder) {
      this.setState({selected: { label: newProps.placeholder, value: '' }})
    }
    if (newProps.options)
    {
      this.setState({ options: newProps.options})
    }
  }

  componentDidMount () {
    document.addEventListener('click', this.handleDocumentClick, false)
    document.addEventListener('touchend', this.handleDocumentClick, false)
  }

  componentWillUnmount () {
    this.mounted = false
    document.removeEventListener('click', this.handleDocumentClick, false)
    document.removeEventListener('touchend', this.handleDocumentClick, false)
  }

  handleMouseDown (event) {
    if (event.type === 'mousedown' && event.button !== 0) return
    event.stopPropagation()
    event.preventDefault()

    if (!this.props.disabled) {
      this.setState({
        isOpen: !this.state.isOpen
      })
    }
  }

  setValue (value, label) {
    let newState = {
      selected: {
        value,
        label
      },
      isOpen: false
    }
    this.fireChangeEvent(newState)
    this.setState(newState)
  }

  fireChangeEvent (newState) {
    if (newState.selected !== this.state.selected && this.props.onChange) {
      this.props.onChange(newState.selected)
    }
  }

  iconClicked (value) {
    this.props.itemIconClick(value)
  }

  renderOption (option) {
    let optionClass = classNames({
      [`${this.props.baseClassName}-option`]: true,
      'is-selected': option === this.state.selected
    })

    let value = option.value || option.label || option
    let label = option.label || option.value || option
    let icon = null
    if (option.iconClasses) {
      icon = <div className='pull-right' style={{ 'width': '18px' }}><i className={option.iconClasses} onMouseDown={this.iconClicked.bind(this, value)} /></div>
    }
    return (
      <div key={value}
        className={optionClass}
        onMouseDown={this.setValue.bind(this, value, label)}
        onClick={this.setValue.bind(this, value, label)}>
        <div style={{ 'display': 'inline' }}>{label}</div>
        {icon}
      </div>
    )
  }

  buildMenu () {
    let { options } = this.state
    let { baseClassName } = this.props
    let ops = options ? options.map((option) => {
      if (option.type === 'group') {
        let groupTitle = (<div className={`${baseClassName}-title`}>{option.name}</div>)
        let _options = option.items ? option.items.map((item) => this.renderOption(item)) : null

        return (
          <div className={`${baseClassName}-group`} key={option.name}>
            {groupTitle}
            {_options}
          </div>
        )
      } else {
        return this.renderOption(option)
      }
    }) : null

    return ops.length ? ops : <div className={`${baseClassName}-noresults`}>No options found</div>
  }
  collapse () {
    this.setState({ isOpen: false })
  }
  render () {
    const { baseClassName } = this.props
    const disabledClass = this.props.disabled ? 'Dropdown-disabled' : ''
    const placeHolderValue = typeof this.state.selected === 'string' ? this.state.selected : this.state.selected.label
    let value = (<span className={`${baseClassName}-placeholder`} >{placeHolderValue}</span>)
    let menu = this.state.isOpen ? <div className={`${baseClassName}-menu`}>{this.buildMenu()}</div> : null

    let dropdownClass = classNames({
      [`${baseClassName}-root`]: true,
      'is-open': this.state.isOpen
    })

    return (
      <div className={dropdownClass} style={{'display': this.state.display}} onBlur={this.collapse}>
        <div className={`${baseClassName}-control ${disabledClass}`} onMouseDown={this.handleMouseDown.bind(this)} onTouchEnd={this.handleMouseDown.bind(this)} style={{'display': this.state.display}}>
          {value}
          <span className={`${baseClassName}-arrow`} />
        </div>
        {menu}
      </div>
    )
  }

}

Dropdown.defaultProps = { baseClassName: 'Dropdown' }
export default Dropdown
