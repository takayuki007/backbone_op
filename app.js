// let Backbone = require('../node_modules/backbone/backbone');
// let $ = require('../node_modules/jquery/dist/jquery');
// let _ = require('../node_modules/underscore/underscore');

//model
let ItemModel = Backbone.Model.extend({
    defaults:{
        text: '',
        isDone: false,
        editMode: false
    }
});

let Form = Backbone.Model.extend({
    defaults: {
        val: '',
        hasErr: false,
        errMsg: '入力が空です。'
    }
});

let form = new Form();

//collection
let List = Backbone.Collection.extend({
    model: ItemModel,
});
let item1 = new ItemModel({text: 'sample todo1'});
let item2 = new ItemModel({text: 'sample todo2'});
let list = new List([item1, item2]);

//view
let ItemView = Backbone.View.extend({
    template: _.template($('#template-item').html()),
    events: {
        'click .js-toggle-done': 'toggleDone',
        'click .js-click-trash': 'remove',
        'click .js-click-item-text': 'editShow',
        'keyup .js-list-item-edit': 'closeEdit'
    },
    initialize:function ()
    {
        _.bindAll(this,'toggleDone','remove','editShow','closeEdit','render');
        this.model.bind('change',this.render);
        this.model.bind('destroy',this.remove);
    },
    toggleDone: function ()
    {
        this.model.set({Done: !this.model.get('Done')})
    },
    remove: function ()
    {
        this.$el.remove();
        return this;
    },
    editShow: function ()
    {
        this.model.set({editMode: true});
    },
    closeEdit: function (e)
    {
        if(e.keyCode === 13 && e.shiftKey === true){
            this.model.set({text: e.currentTarget.value, editMode: false});
        }
    },
    render: function ()
    {
        console.log('render item');
        let template = this.template(this.model.attributes);
        this.$el.html(template);
        return this;
    }
});

let ListView = Backbone.View.extend({
    el: $('.js-todo-list'),
    collection: list,
    initialize: function ()
    {
        _.bindAll(this, 'addItem', 'appendItem', 'render');
        this.collection.bind('add', this.appendItem);
        this.render();
    },
    addItem: function (text)
    {
        let model = new ItemModel({text: text});
        this.collection.add(model);
    },
    appendItem: function (model)
    {
        let itemView = new ItemView({model: model});
        this.$el.append(itemView.render().el);
    },
    render: function ()
    {
        console.log('render list');
        let that = this;
        this.collection.each(function (model){
            that.appendItem(model);
        });
        return this;
    }
});

let listView = new ListView({collection: list});

let FormView = Backbone.View.extend({
    el: $('.js-form'),
    template: _.template($('#template-form').html()),
    model: form,
    events: {
        'click .js-add-todo': 'addTodo'
    },
    initialize: function ()
    {
        _.bindAll(this, 'render', 'addTodo');
        this.model.bind('change', this.render);
        this.render();
    },
    addTodo: function (e)
    {
        e.preventDefault();
        this.model.set({val: $('.js-get-val').val()});
        listView.addItem(this.model.get('val'));
    },
    render: function ()
    {
        let template = this.template(this.model.attributes);
        this.$el.html(template);
        return this;
    }
});
new FormView();