/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 *
 */

import React, { useEffect, useState, useRef } from 'react';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import { Typography, Paper, Fab, Container, SwipeableDrawer, List, ListItem, ListItemText, ListSubheader } from '@material-ui/core';
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu'

const langauges = [
  { lang: 'English - India', code: 'en-IN' },
  { lang: 'ಕನ್ನಡ', code: 'kn-IN' },
  { lang: 'മലയാളം', code: 'ml-IN' },
  { lang: 'தமிழ்', code: 'ta-IN' },
  { lang: 'తెలుగు', code: 'te-IN' },
  { lang: 'हिन्दी', code: 'hi-IN' },
]
const useStyles = makeStyles((theme) => ({
  fab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  paper: {
    padding: theme.spacing(3)
  },
  container: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  drawerButton: {
    textTransform: `capitalize`
  },
}));

export default function HomePage() {
  const classes = useStyles();
  const [isListening, setIsListening] = useState(false)
  const [openDrawer, setOpenDrawer] = useState(false)
  const [selectedLang, setSelectedLang] = useState('hi-IN')
  let finalValue = ''
  const outputRef = useRef();
  let start, stop
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  if (typeof SpeechRecognition === "undefined") {
    alert("We don't support your platform")
  }

  const recognition = new SpeechRecognition();
  start = (lang) => {
    console.log('start')
    recognition.lang = lang ? lang : selectedLang
    recognition.start();
    setIsListening(true)
  };
  stop = () => {
    console.log('stop')
    setIsListening(false)
    recognition.stop();
  };
  const onResult = event => {
    console.log(event.results)
    let interimValue = ''
    for (var i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        finalValue += event.results[i][0].transcript
        outputRef.current.innerHTML = finalValue
      } else {
        interimValue += event.results[i][0].transcript
        outputRef.current.innerHTML = finalValue + `<i>${interimValue}</i>`
      }
    }
  }
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.addEventListener("result", onResult);


  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton onClick={() => setOpenDrawer(true)} edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Speech To Text
          </Typography>
        </Toolbar>
      </AppBar>
      <SwipeableDrawer
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
      >
        <List
          subheader={
            <ListSubheader component="div" id="nested-list-subheader">
              Select any Language
        </ListSubheader>
          }
        >
          {langauges.map(langauge => <ListItem
            button
            onClick={() => { setSelectedLang(langauge.code); setOpenDrawer(false); stop(); start(langauge.code) }}
            selected={selectedLang == langauge.code}
          >
            <ListItemText>
              {langauge.lang}
            </ListItemText>
          </ListItem>)}
        </List>
      </SwipeableDrawer>
      <Container maxWidth="sm" className={classes.container}>
        <Paper className={classes.paper}>
          <Typography variant='body1' ref={outputRef} />
        </Paper>
        <Fab color='primary' className={classes.fab} onClick={() => isListening ? stop() : start()}>{isListening ? <MicOffIcon /> : <MicIcon />}</Fab>
      </Container>
    </>
  );
}
