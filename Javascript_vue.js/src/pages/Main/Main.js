import React, { Component } from 'react';
import axios from 'axios';
import './Main.scss';
import Student from '../../components/Student/Student';

export default class Main extends Component {
  state = {
    data: null,
    nameSearch: '',
    tagSearch: '',
    filter: null
  }

  getApi = () => {
    axios.get('https://www.hatchways.io/api/assessment/students')
      .then(res => {
        let data = {}
        res.data.students.forEach(student => {
          let withTags = {
            ...student,
            tags: []
          }
          data[student.id] = withTags
        })
        this.setState({ data: data })
      })
  }

  search = (event) => {
    if (event.target.id === "name-input") {
      this.setState({ nameSearch: event.target.value })
    } else if (event.target.id === "tag-input") {
      this.setState({ tagSearch: event.target.value })
    }
  }

  filterStudents = () => {
    const filter = Object.values(this.state.data).filter(student => {
      const nameSearch = this.state.nameSearch.toLowerCase()
      const fname = student.firstName.slice(0, nameSearch.length).toLowerCase()
      const lname = student.lastName.slice(0, nameSearch.length).toLowerCase()

      const tagSearch = this.state.tagSearch.toLowerCase()
      let tagFound = null
      if (tagSearch) {
        tagFound = student.tags.find(tag => tagSearch === tag.slice(0, tagSearch.length) ? tag : null)
      }

      if (!nameSearch && !tagFound) {
        return student
      } else if ((nameSearch === fname || nameSearch === lname) || tagFound) {
        return student
      } else {
        return null
      }
    })
    return filter
  }

  updateTags = (event) => {
    event.preventDefault()
    if (event.target.newTag.value) {
      const update = Object.values(this.state.data).find(student => student.id === event.target.id)
      update.tags.push(event.target.newTag.value)
      const newState = {
        ...this.state.data,
        [update.id]: update
      }
      this.setState({ data: newState })
      event.target.newTag.value = ''
    }
  }

  render() {
    let filter = null
    if (!this.state.data) {
      this.getApi()
    } else {
      filter = this.filterStudents()
    }

    return (
      <div className="main">
        <div className="main__content">
          <div className="main__header">
            <input className="main__search" id="name-input" type="text" placeholder="Search by name" onChange={this.search} />
            <input className="main__search" id="tag-input" type="text" placeholder="Search by tags" onChange={this.search} />
          </div>
          <div className="main__list">
            {filter ?
              filter.map(student => {
                return (
                  <Student key={student.id} data={student} updateTags={this.updateTags} />
                )
              })
              : null}
          </div>
        </div>
      </div>
    )
  }
};
