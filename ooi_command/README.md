# Technical documentation

This widget allows the user to issue commands to objects of interest through the UI.

## Internal command object structure

This widget uses an *internal* command structure that is passed along to compatible widgets (eg the
worldstate_saver) for actual processing. These commands are basically JSON objects and have at least up to four major
properties:

* **affected**: an array of entity IDs where these changes should be executed.
* **setProperties**: a map where the keys identify entity property IDs and the values are the values to change the
  entity's property to (EntityProperty data on the OOIWSR side).
* **setGeometry**: as above, but with the entity's geometry (EntityGeometry data on the OOIWSR side).
* **log**: a string that gives a human-readable explanation of what this command does.

For example:

    { affected: [1, 3], setProperties: { 101: 'hello', 203: 'world' }, setGeometry: 'POINT (1, 2)' }

The only mandatory field here is **affected**. It must be provided at all times.

Additional properties can be appended but they are likely to be ignored by the worldstate_saver widget. 

## Command definitions

All UI commands are defined in js/commands.js and should be maintained there. This file defines a constant with all
commands that should be rendered in the UI.

Each entry consists of several important properties that define it:

* **id**: this is an internal, unique identifier. It serves no purpose outside the widget.
* **css**: a CSS that will be applied to the command entry in the UI for styling purposes.
* **displayName**: a human-readable name for this command.
* **help**: a human-readable explanation of what this command does.
* **log**: a string that gives a human-readable explanation of what this command does. This differs from displayName insofar
  as this can contain placeholders like `#{data[1]}` to reference data provided by the user. This should be a *concrete*
  information about this particular command instance does whereas "help" should only provide general information.
* **arguments**: this is an array of arguments that the user can provide for this command.
    * **displayName**: the human-readable name of this argument
    * **targetType**: this indicates to the UI how to present this argument. Currently supported values are:
      option, ooi, number, geometry, point. Depending on this value, additional properties may be required.
    * **options** (only for `targetType: option`): a human-readable string array of options the user can select.
    * **targetRestrictedTo** (only for `targetType: ooi`): an entityTypeId to signal what kind of OOI is allowed here.
      If not provided, any OOI is accepted.
    * **isTargetAllowed** (only for `targetType: ooi`): you can define a function here that will check if a potential
      candidate for this argument is allowed. If this function returns a truthy value, it will be accepted by the UI,
      otherwise it will not. If this property is not provided, there will be no restrictions.
    * **multiple** (only for `targetType: ooi`): determines if multiple OOIs can be selected by the user. By default,
      only one can be selected.
    * **display** (only for `targetType: ooi`): you can define a callback function here that will format the OOI for
      display in the UI. The function will be provided with the OOI itself, the command itself, as well as the angular
      $scope instance.
    * **minimum** (only for `targetType: number`)
    * **maximum** (only for `targetType: number`)
    * **optional**: indicates that an argument is optional. By default, all arguments are mandatory.
* **apply**: this is a complex callback function with the arguments `command, data, oois, allOOIs` that is expected
  to generate a command object (as described in the beginning of this file), *or* an array of command objects.
  `command` will hold the original command definition and `data` will hold all the argument values provided by the
  user. `oois` and `allOOIs` hold worldstate data should it be required for contextual reasons.
  
### Example:

        {
            id: 'v2-refill',
            css: 'ico-cmd-treat',
            displayName: 'Refill',
            help: 'Command resource vehicle to refill its resources',
            log: 'Vehicle should refill at #{data[1].entityName}',

            arguments: [
                { displayName: 'Vehicle', targetType: 'ooi', targetRestrictedTo: 7, // 7=Vehicle
                  multiple: true, display: function (x) { return x.entityName; } },
                { displayName: 'Refill at', targetType: 'ooi', targetRestrictedTo: 8 } // 8=RescueStation
            ],

            apply: function (command, data) {
                command.affected = data[0];
                command.setProperties = {
                    1000: JSON.stringify({
                        'Command-Type': 'Refill',
                        'Command-From-OOI-Identifier': '',
                        'Command-To-OOI-Identifier': data[1].entityId,
                        'Command-Parameters': ''
                    })
                };

                return command;
            }
        }

This is a simplified version of the pilot C command "Refill" (which orders an ambulance to replenish its resources
at a designated rescue station). The command only requires two parts: which ambulances to refill, and where to refill
them. The ambulances form the `affected` part as we need to set properties for them when executing it. The property
that is being changed has the id 1000 and it's set to a complex JSON object with the command details (as per the pilot
C specification).

## Adding new commands

Adding new commands is relatively straight forward if they follow the same pattern as any of the already existing
commands.

Should there be any special requirements regarding UI aspects, the best way to implement it would be to define
a new targetType from scratch. You'll need to adapt the index.html file for this (look for the ng-switch and
define your mark-up in there). You can also initialize default values for your new targetType in the
$scope.activateCommand function in main.js if required.