/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 *
 */

import React, { useState } from 'react';
import { Typography, Paper, Fab, Container, SwipeableDrawer, List, ListItem, ListItemText, ListSubheader } from '@material-ui/core';
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'

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
  const [openDrawer, setOpenDrawer] = useState(false)
  const [selectedLang, setSelectedLang] = useState('en-IN')

  const {
    transcript,
    interimTranscript,
    finalTranscript,
    resetTranscript,
    listening,
  } = useSpeechRecognition()
  
  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return null
  }
console.log(transcript)
  return (
    <>
      <AppBar position="static" color={listening ? 'secondary' : 'primary'}>
        <Toolbar >
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
            onClick={ () => { 
               if(listening)
               SpeechRecognition.abortListening()

              setSelectedLang(langauge.code); 
              setOpenDrawer(false);
              }}
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
          <Typography variant='body1'>
            {finalTranscript}{' '}
            <i>{interimTranscript}</i>
          </Typography>
        </Paper>
        <Fab 
        color={listening ? 'secondary' : 'primary'} 
        className={classes.fab} 
        onClick={() => listening ? SpeechRecognition.stopListening() : SpeechRecognition.startListening({continuous: true, language: selectedLang})}
        >
        {listening ? <MicOffIcon /> : <MicIcon />}
        </Fab>
      </Container>
    </>
  );
}
