import React, { useState } from 'react';
import CountUp from 'react-countup';
import {
  Card,
  ListGroup,
  Badge,
  ProgressBar,
  Modal,
  Button,
  Form,
} from 'react-bootstrap';
import {
  FaBirthdayCake,
  FaCalendar,
  FaUser,
  FaGem,
} from 'react-icons/fa';
import {
  startOfWeek,
  addDays,
  format,
  addWeeks,
  isBefore,
  isSameWeek,
  isSameDay,
  parseISO,
} from 'date-fns';
import './RightPanel.css';

const generateWeeks = () => {
  const startDate = new Date(2025, 0, 1); // Jan 1, 2025
  const endDate = new Date(2025, 11, 31); // Dec 31, 2025
  let weeks = [];
  let current = startOfWeek(startDate, { weekStartsOn: 1 });

  while (isBefore(current, endDate)) {
    const week = Array.from({ length: 7 }, (_, i) => addDays(current, i));
    weeks.push(week);
    current = addWeeks(current, 1);
  }
  return weeks;
};

const RightPanel = () => {
  const today = new Date();
  const [points, setPoints] = useState(1284);
  const rewardGoal = 2000;

  const [birthdays, setBirthdays] = useState([
    { name: 'John', date: '2025-02-04' },
    { name: 'Aisha', date: '2025-07-27' },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [newBdayName, setNewBdayName] = useState('');
  const [newBdayDate, setNewBdayDate] = useState('');

  const allWeeks = generateWeeks();
  const initialWeekIndex = allWeeks.findIndex(week =>
    isSameWeek(week[0], today, { weekStartsOn: 1 })
  );
  const [currentWeekIndex, setCurrentWeekIndex] = useState(
    initialWeekIndex === -1 ? 0 : initialWeekIndex
  );
  const currentWeek = allWeeks[currentWeekIndex];
  const currentMonth = format(currentWeek[0], 'MMMM yyyy');
  const progress = Math.min(Math.round((points / rewardGoal) * 100), 100);

  const handleSend = () => {
    if (points >= 100) setPoints(points - 100);
  };

  const handleRedeem = () => {
    if (points >= 200) setPoints(points - 200);
  };

  const handleAddBirthday = () => {
    if (newBdayName && newBdayDate) {
      setBirthdays([...birthdays, { name: newBdayName, date: newBdayDate }]);
      setNewBdayName('');
      setNewBdayDate('');
      setShowModal(false);
    }
  };

  const birthdaysThisWeek = birthdays.filter(b =>
    currentWeek.some(d => isSameDay(parseISO(b.date), d))
  );

  return (
    <div className="right-panel p-3">
      {/* Points Section */}
      <Card className="mb-4 shadow-sm border-0">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center my-2">
            <h6 className="mb-0 fw-semibold">Your Points</h6>
            <Badge
              bg="primary"
              className="rounded-pill fs-3 px-4 py-2 text-white d-flex align-items-center gap-2"
            >
              <FaGem style={{ color: '#00cfff' }} />
              <CountUp end={points} duration={1.5} />
            </Badge>
          </div>
          <div className="mb-2">
            <ProgressBar now={progress} variant="success" style={{ height: '8px' }} />
            <small className="text-muted">Reward goal: {rewardGoal} pts</small>
          </div>
          <div className="d-flex mt-2">
            <button className="btn btn-sm btn-outline-primary me-2" onClick={handleSend}>
              SEND
            </button>
            <button className="btn btn-sm btn-outline-success" onClick={handleRedeem}>
              REDEEM
            </button>
          </div>
        </Card.Body>
      </Card>

      {/* Calendar Section */}
      <Card className="mb-3">
        <Card.Body>
          <h6 className="text-muted">{currentMonth}</h6>
          <div className="calendar-grid">
            {currentWeek.map((date) => {
              const dayName = format(date, 'EEE');
              const dayNumber = format(date, 'd');
              const isToday = isSameDay(date, today);
              const hasBirthday = birthdays.some(b => isSameDay(parseISO(b.date), date));

              return (
                <div
                  key={date.toString()}
                  className={`calendar-day ${isToday ? 'today' : ''} ${hasBirthday ? 'birthday' : ''}`}
                >
                  <div className="day-name">{dayName.toUpperCase()}</div>
                  <div className="day-number">
                    {dayNumber} {hasBirthday && '🎂'}
                  </div>
                </div>
              );
            })}

            <div
              className="calendar-event marked"
              role="button"
              onClick={() => setShowModal(true)}
            >
              <FaBirthdayCake className="m-1" style={{ color: '#ff69b4' }} />
              Birthdays
            </div>
          </div>

          {birthdaysThisWeek.length > 0 && (
            <div className="mt-2">
              <small className="text-muted">This Week:</small>
              <ul className="ms-3 mt-1">
                {birthdaysThisWeek.map((b, i) => (
                  <li key={i} className="small">
                    {b.name} — {format(parseISO(b.date), 'do MMM')}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Navigation */}
          <div className="next-week-wrapper d-flex justify-content-between mt-2">
            {currentWeekIndex > 0 && (
              <div
                className="calendar-event marked"
                role="button"
                onClick={() => setCurrentWeekIndex(i => i - 1)}
              >
                ← Prev Week
              </div>
            )}
            {currentWeekIndex < allWeeks.length - 1 && (
              <div
                className="calendar-event marked ms-auto"
                role="button"
                onClick={() => setCurrentWeekIndex(i => i + 1)}
              >
                Next Week →
              </div>
            )}
          </div>

          <div className="mt-2">
            <small className="text-muted">Work anniversary</small>
          </div>
        </Card.Body>
      </Card>

      {/* Meetings */}
      <Card className="mb-3">
        <Card.Body>
          <ListGroup variant="flush">
            <ListGroup.Item className="d-flex justify-content-between align-items-center">
              <div>
                <FaUser size={18} style={{ color: '#6f42c1' }} />{' '}
                <strong>Weekly Review Meeting</strong>
                <div className="text-muted small">11:00 am - 12:00 pm</div>
              </div>
              <Badge bg="light" text="dark">
                +6 attending
              </Badge>
            </ListGroup.Item>

            <ListGroup.Item>
              <strong>Client Meeting - RAB</strong>
              <div className="text-muted small">01:00 pm - 02:00 pm</div>
            </ListGroup.Item>
          </ListGroup>
        </Card.Body>
      </Card>

      {/* Events */}
      <Card>
        <Card.Body>
          <h6>
            <FaCalendar className="m-2" style={{ color: '#20c997' }} />
            Upcoming Events
          </h6>

          <ListGroup variant="flush">
            <ListGroup.Item>
              <div className="d-flex justify-content-between">
                <span>Team Building Workshop</span>
                <small className="text-muted">15 Oct</small>
              </div>
              <small className="text-muted">10:00 AM - 2:00 PM</small>
            </ListGroup.Item>

            <ListGroup.Item>
              <div className="d-flex justify-content-between">
                <span>Employee of the Month Award</span>
                <small className="text-muted">20 Oct</small>
              </div>
              <small className="text-muted">3:00 PM - 4:30 PM</small>
            </ListGroup.Item>

            <ListGroup.Item>
              <div className="d-flex justify-content-between">
                <span>Diversity and Inclusion Seminar</span>
                <small className="text-muted">5 Nov</small>
              </div>
              <small className="text-muted">9:30 AM - 12:00 PM</small>
            </ListGroup.Item>

            <ListGroup.Item className="fw-bold">
              <div className="d-flex justify-content-between">
                <span>Town Hall Meeting</span>
                <small className="text-muted">10 Nov</small>
              </div>
            </ListGroup.Item>
          </ListGroup>
        </Card.Body>
      </Card>

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Birthday</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-2">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              value={newBdayName}
              onChange={(e) => setNewBdayName(e.target.value)}
              placeholder="Enter name"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Date</Form.Label>
            <Form.Control
              type="date"
              value={newBdayDate}
              onChange={(e) => setNewBdayDate(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddBirthday}>
            Add
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default RightPanel;