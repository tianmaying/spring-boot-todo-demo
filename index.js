$(function() {
    // Utils
    function parseTodo($li) {
        return {
            completed: $li.find('.view .toggle').prop('checked'),
            content: $li.find('.view label').html(),
            id: $li.data('id')
        };
    }
    $.fn.onEnter = function(cb) {
        var $input = $(this);
        $input.bind('keypress', function(e) {
            if (e.keyCode == '13') cb(e);
        });
    };
    function updateCount(){
        $count.html($list.find('li').not('.completed').length);
    }

    // Views
    var $content = $('#new-todo'),
        $list = $('#todo-list'),
        $count = $('#todo-count strong'),
        $clear = $('#clear-completed');

    $content.onEnter(function() {
        if (!$content.val()) return;
        var $todo = makeTodo({content: $content.val()});
        $list.prepend($todo);
        create($todo);
        updateCount();
        $content.val('');
    });
    $clear.click(function(){
        $list.find('li.completed').each(function(li){
            remove($(li));
        }).remove();
        updateCount();
    });

    queryList();
    updateCount();

    function makeTodo(todo) {
        var $li = $('<li>', {
                class: todo.completed ? 'completed' : ''
            }),
            $view = $('<div>', {
                class: 'view'
            }),
            $edit = $('<input>', {
                class: 'edit',
                value: todo.content
            }),
            $check = $('<input>', {
                class: 'toggle',
                type: 'checkbox',
                checked: todo.completed
            }),
            $label = $('<label>' + todo.content + '</label>'),
            $del = $('<button>', {
                class: 'destroy'
            });
        $li.data('id', todo.id);
        // Edit
        $check.change(function() {
            $li.toggleClass('completed');
            update($li);
            updateCount();
        });
        $label.click(function() {
            $edit.val(parseTodo($li).content);
            $view.hide();
            $edit.show().focus();
        });
        $edit.onEnter(function(e) {
            if (!$edit.val()) return;
            $label.html($edit.val());
            $edit.hide().val('');
            $view.show();
            update($li);
        });
        // Delete View
        $del.click(function() {
            remove($li);
            $li.remove();
            updateCount();
        });
        $view.append($check).append($label).append($del);
        $li.append($view).append($edit);
        return $li;
    }

    // CRUD
    function queryList() {
        // $.get xxx
        var todos = [{
            completed: false,
            content: '写代码'
        }, {
            completed: true,
            content: '睡觉'
        }];
        todos.forEach(function(todo) {
            var $li = makeTodo(todo);
            $list.append($li);
        });
    }

    function create($li) {
        var todo = parseTodo($li);
        $.post('/todos', todo).done(function(data) {
            $li.data('id', data.id);
        });
        console.log('create todo:', todo);
    }

    function update($li) {
        var todo = parseTodo($li);
        $.ajax({
            url: '/todos/' + todo.id,
            type: 'PUT',
            data: todo
        });
        console.log('update todo:', todo);
    }

    function remove($li) {
        var todo = parseTodo($li);
        $.ajax({
            url: '/todos/' + todo.id,
            type: 'DELETE'
        });
        console.log('delete todo:', todo);
    }
});
