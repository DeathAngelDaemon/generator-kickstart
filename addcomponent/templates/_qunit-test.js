define(['jquery', 'qunit', '<%= slug_name %>'], function($, qunit, <%= class_name %>) {

  'use strict';

  return function() {

    qunit.module("<%= class_name %>");

    qunit.test("<%= class_name %> Test", function() {
      equal(false, true, "Function should return 'false'");
    });

    // qunit.asyncTest("<%= class_name %> Test", function() {
    //   expect(1);

    //   $('#qunit-fixture').load('../components/app/<%= slug_name %>/<%= slug_name %>.html', function(data) {
    //     <%= class_name %>.init();
    //     ok($('.<%= class_name %>').hasClass('lorem'), ".<%= class_name %> should have class 'lorem'");
    //     qunit.start();
    //   });

    // });

  };

});
