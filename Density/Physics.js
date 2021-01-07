var physicsLinesToDraw = [];
var physicsCirclesToDraw = [];
var physicsLinesToSleep = [];
var physicsCirclesToSleep = [];
var showCalcs = false;

function closest_point_on_seg(seg_a, seg_b, circ_pos, id) {
    var seg_v = seg_b.subV(seg_a);
    var pt_v = circ_pos.subV(seg_a);
    var seg_v_length = seg_v.length();
    if (seg_v_length <= 0) {
        console.log("Illegal physics item! Index: " + id);
        return;
    }
    var seg_v_unit = seg_v.divS(seg_v_length);
    var proj = pt_v.dot(seg_v_unit);

    if (proj <= 0) {
        return seg_a;
    }
    if (proj >= seg_v_length) {
        return seg_b;
    }
    var proj_v = seg_v_unit.mulS(proj);

    var closest = proj_v.addV(seg_a);
    if (showCalcs) {
        checkOrReplaceLine(id + 50000, {
            a: closest,
            b: seg_a,
            id: id + 50000,
            color: "blue"
        });
        checkOrReplaceLine(id + 60000, {
            a: closest,
            b: circ_pos,
            id: id + 60000,
            color: "blue"
        });
        checkOrReplaceLine(id + 70000, {
            a: seg_a,
            b: circ_pos,
            id: id + 70000,
            color: "#7979b5"
        });
        checkOrReplaceCircle(id + 80000, {
            pos: closest,
            id: id + 80000,
            color: "blue"
        });
        checkOrReplaceCircle(id + 90000, {
            pos: circ_pos,
            id: id + 90000,
            color: "blue"
        });
        checkOrReplaceCircle(id + 100000, {
            pos: seg_a,
            id: id + 100000,
            color: "blue"
        });
    }
    return closest;
}

function checkOrReplaceLine(id, line) {
    var contained = false;
    for (let i = 0; i < physicsLinesToDraw.length; i++) {
        const element = physicsLinesToDraw[i];
        if (element.id == id) {
            physicsLinesToDraw[i] = line;
            contained = true;
        }
    }
    if (!contained) {
        physicsLinesToDraw.push(line);
    }
}

function checkOrReplaceCircle(id, circle) {
    var contained = false;
    for (let i = 0; i < physicsCirclesToDraw.length; i++) {
        const element = physicsCirclesToDraw[i];
        if (element.id == id) {
            physicsCirclesToDraw[i] = circle;
            contained = true;
        }
    }
    if (!contained) {
        physicsCirclesToDraw.push(circle);
    }
}


function segment_circle(lines, circ_pos, circ_rad) {
    var offset = new Vec2(0, 0);
    if (showCalcs) {
        for (let i = 0; i < physicsLinesToDraw.length; i++) {
            const element = physicsLinesToDraw[i];
            element.color = "#800000";
        }
        for (let i = 0; i < physicsCirclesToDraw.length; i++) {
            const element = physicsCirclesToDraw[i];
            element.color = "#800000";
        }
    }
    for (var i = 0; i < lines.length; i++) {
        var seg_a = lines[i].a;
        var seg_b = lines[i].b;
        var closest = closest_point_on_seg(seg_a, seg_b, circ_pos, i);
        var dist_v = circ_pos.subV(closest);
        if (dist_v.length() > circ_rad) {
            continue;
        }
        if (dist_v.length() <= 0) {
            continue;
        }
        var offset = offset.addV(dist_v.divS(dist_v.length()).mulS(circ_rad - dist_v.length()));
    }
    return offset;
}