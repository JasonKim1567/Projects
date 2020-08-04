import React, { Component } from 'react';
import './Student.scss';
import plus from '../../assets/plus.png';
import minus from '../../assets/minus.png';

export default class Student extends Component {
  state = {
    grades: false,
  }

  toggleGrades = (event) => {
    this.setState({ grades: !this.state.grades })
  }

  render() {
    const { id, pic, firstName, lastName, email, company, skill, grades, tags } = this.props.data
    const average = grades.reduce((prev, curr) => Number(prev) + Number(curr)) / grades.length

    return (
      <div className="student">
        <img className="student__pic" src={pic} alt="student profile" />
        <div className="student__content">
          <div className="student__header">
            <h1 className="student__name">{`${firstName} ${lastName}`}</h1>
            <button className="expand-btn" onClick={this.toggleGrades}>
              {this.state.grades ?
                <img className="student__toggle-icon" src={minus} alt="collapse" /> :
                <img className="student__toggle-icon" src={plus} alt="expand" />}
            </button>
          </div>
          <div className="student__info">
            <p className="student__text">{`Email: ${email}`}</p>
            <p className="student__text">{`Company: ${company}`}</p>
            <p className="student__text">{`Skill: ${skill}`}</p>
            <p className="student__text">{`Average: ${average}`}</p>
            {this.state.grades ?
              <div className="student__grades">
                {grades.map((grade, index) => {
                  return (
                    <p key={grade + index} className="student__text">{`Test ${index}: ${grade}`}</p>
                  )
                })}
                <div className="student__tags">
                  {tags.map((tag, index) => {
                    return (
                      <div key={tag + index} className="student__tag">
                        <p className="student__tag-text">{tag}</p>
                      </div>
                    )
                  })}
                </div>
                <form className="student__form" id={id} autoComplete="off" onSubmit={this.props.updateTags}>
                  <input className="add-tag-input" type="text" name="newTag" placeholder="Add a tag" />
                </form>
              </div>
              : null}
          </div>
        </div>
      </div>
    )
  }
}
