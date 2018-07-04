/**
 * Copyright 2018 - Author gauravm.git@gmail.com
 */

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
    .html('Status: Connecting to "ws://localhost:3897"...');
  outputDiv
    .append(infoElem);

  const connection = new WebSocket('ws://localhost:3897', 'build-system-websocket');

  connection.onopen = () => {
    // connection is opened and ready to use
    infoElem = $('<span />')
      .addClass('info')
      .html('Status: Connected.');

    outputDiv
      .append(infoElem);

  };

  connection.onerror = (error) => {
    // an error occurred when sending/receiving data
    const errorElem = $('<span />')
      .addClass('error')
      .html('WebSocket error: ' + error);

    outputDiv
      .append(errorElem);

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

      const span = $('<span />')
        .addClass('output-line')
        .html(jsonData);

      // Add the output.
      outputDiv.append(span);

    }

  };

});
