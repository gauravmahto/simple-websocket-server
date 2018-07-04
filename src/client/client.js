/**
 * Copyright 2018 - Author gauravm.git@gmail.com
 */

const wsServerPath = 'ws://ajitvm006:3897';
const wsProtocol = 'build-system-websocket';

$(() => {

  const outputDiv = $('.console-output');

  // if user is running mozilla then use it's built-in WebSocket
  window.WebSocket = window.WebSocket || window.MozWebSocket;

  if (!window.WebSocket) {

    const errorElem = $('<span />')
      .addClass('error')
      .html('WebSocket is not supported.');
    outputDiv
      .append(errorElem);

    return;

  }

  let infoElem = $('<span />')
    .addClass('info')
    .html('Status: Connecting to ' + '"' + wsServerPath + '"...');
  outputDiv
    .append(infoElem);

  const connection = new WebSocket(wsServerPath, wsProtocol);

  connection.onopen = () => {
    // connection is opened and ready to use
    infoElem = $('<span />')
      .addClass('info')
      .html('Status: Connected.');
    outputDiv
      .append(infoElem);

    infoElem = $('<span />')
      .addClass('info')
      .html('Status: Starting operations...');
    outputDiv
      .append(infoElem);

    // Start the copy and install operation.
    connection.send('start-copy-install');

  };

  connection.onerror = (error) => {
    // an error occurred when sending/receiving data
    const errorElem = $('<span />')
      .addClass('error')
      .html('WebSocket: Some error happened.');
    outputDiv
      .append(errorElem);

    console.log(error);

  };

  connection.onclose = (reason) => {

    infoElem = $('<span />')
      .addClass('info')
      .html('Status: Disconnected.');
    outputDiv
      .append(infoElem);

    console.log(reason);

  };

  connection.onmessage = (message) => {

    let jsonData;

    try {

      jsonData = JSON.parse(message.data);

    } catch (e) {

      console.log('This doesn\'t look like a valid JSON: ',
        message.data);

      return;

    }

    if (typeof jsonData !== 'undefined') {

      let span = '';

      if (typeof jsonData.data !== 'undefined') {

        span = $('<span />')
          .addClass('result')
          .html(jsonData.data);

      } else if (typeof jsonData.error !== 'undefined') {

        span = $('<span />')
          .addClass('error')
          .html(jsonData.error);

      }

      // Add the output.
      outputDiv
        .append(span);

    }

  };

});
