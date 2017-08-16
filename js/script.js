var dealer_api = 'https://cards.agrrh.com/api/v1/';
var deck_type = 'ru';

var deck_id = false;

function card_decode(card) {
  value = card[0].toUpperCase();
  // 0 to 10 workaround
  if (value == '0') {
    value = '10';
  }

  suits = {
    'h': 'hearts',
    'd': 'diamonds',
    'c': 'clubs',
    's': 'spades'
  }
  suit = suits[card[1]];

  return [value, suit];
}

function deck_new() {
  $.get( dealer_api + 'deal/new/' + deck_type, function( data ) {
    console.log(data);
    deck_id = data.id;

    card = data.card;
    left = data.left;

    draw_history(false);
    draw_actual(card);
    draw_left(left);

    return deck_id;
  });
}

function deck_resume(id) {
  $.get( dealer_api + 'deal/' + id, function( data ) {
    console.log(data);

    old_card = card;

    card = data.card;
    left = data.left;

    draw_history(old_card);
    draw_actual(card);
    draw_left(left);
  });
}

function draw_actual(card) {
  if (card != null) {
    [value, suit] = card_decode(card);

    $( ".hand .actual .col" ).html(
      '<div class="card face suit-' + suit + '">' + value + '</div>'
    );
  } else {
    $( ".hand .actual .col" ).html('<div class="card"></div>');
    deck_id = false;
  }
}

function draw_left(count) {
  if (deck_id) {
    $(".deck").html('<div class="card back left">' + left + '</div>');
  } else {
    $(".deck").html('<div class="card left">0</div>');
  }

  $(".deck .left").click(function() {
    if (deck_id) {
      deck_resume(deck_id);
    } else {
      deck_id = deck_new();
    }
  });
}

function draw_history(card) {
  if (card) {
    [value, suit] = card_decode(card);

    $( ".hand .history .col" ).prepend(
      '<div class="card face suit-' + suit + '">' + value + '</div>'
    );
  } else {
    $( ".hand .history .col" ).html('');
  }
}

$(".deck .left").click(function() {
  if (deck_id) {
    deck_resume(deck_id);
  } else {
    deck_id = deck_new();
  }
});
