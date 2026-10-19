'use strict';

/**
 * Product edit field of "reference data multi select" attributes.
 *
 * Values are added through a modal (search, tick several results, add them
 * at once); the selected values stay displayed and removable as chips. The
 * search goes through Akeneo's own reference data endpoint, so it works for
 * any reference data.
 */
define(['underscore', 'oro/translator', 'pim/reference-multi-select-field', 'danmyers-reference-data-picker/picker'], function (
  _,
  __,
  BaseField,
  Picker
) {
  return BaseField.extend({
    events: function () {
      return _.extend({}, _.result(BaseField.prototype, 'events'), {
        'click .danmyers-ReferencePicker-open': 'openPicker',
      });
    },

    /**
     * {@inheritdoc}
     */
    renderInput: function (context) {
      const input = BaseField.prototype.renderInput.apply(this, arguments);
      if (!this.isEditable()) {
        return input;
      }

      return `${input}
        <div class="AknFieldContainer-iconsContainer">
          <span
            class="AknIconButton AknIconButton--plus danmyers-ReferencePicker-open"
            data-toggle="tooltip"
            data-placement="top"
            title="${_.escape(__('danmyers_reference_data_picker.open'))}"
          ></span>
        </div>`;
    },

    /**
     * {@inheritdoc}
     *
     * The select only displays (and removes) values: its own search dropdown
     * is disabled in favour of the modal.
     */
    postRender: function () {
      BaseField.prototype.postRender.apply(this, arguments);

      if (!this.isEditable()) {
        return;
      }

      this.$('.field-input:first input.select-field').on('select2-opening', event => event.preventDefault());
      this.$('.field-input:first').addClass('danmyers-ReferencePicker-field');
    },

    /**
     * Opens the modal and appends the picked codes to the current value.
     */
    openPicker: function () {
      if (!this.isEditable()) {
        return;
      }

      const value = this.getCurrentValue();
      const currentCodes = value && Array.isArray(value.data) ? value.data : [];

      this.getChoiceUrl().then(choiceUrl =>
        Picker.open({
          choiceUrl: choiceUrl,
          title: this.getLabel(),
          subtitle: __('danmyers_reference_data_picker.subtitle'),
          existingCodes: currentCodes,
        }).then(selected => {
          const added = _.pluck(selected, 'code').filter(code => !_.contains(currentCodes, code));
          if (0 === added.length) {
            return;
          }

          this.choicePromise = null;
          this.setCurrentValue(currentCodes.concat(added));
          this.render();
        })
      );
    },
  });
});
